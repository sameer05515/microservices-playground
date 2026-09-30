package com.iagent.javaservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iagent.common.BadRequestException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.jar.model.JarDefinition;
import com.iagent.jar.repository.JarDefinitionRepository;
import com.iagent.javaservice.dto.ExecuteJavaServiceRequest;
import com.iagent.javaservice.dto.ExecuteJavaServiceResponse;
import com.iagent.javaservice.history.JavaServiceExecutionLog;
import com.iagent.javaservice.history.JavaServiceExecutionLogRepository;
import com.iagent.javaservice.model.JavaService;
import com.iagent.javaservice.repository.JavaServiceRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

@Service
public class JavaServiceExecutor {

    private final JavaServiceRepository serviceRepository;
    private final JarDefinitionRepository jarRepository;
    private final ObjectMapper objectMapper;
    private final JavaServiceExecutionLogRepository executionLogRepository;

    public JavaServiceExecutor(
            JavaServiceRepository serviceRepository,
            JarDefinitionRepository jarRepository,
            ObjectMapper objectMapper,
            JavaServiceExecutionLogRepository executionLogRepository) {

        this.serviceRepository = serviceRepository;
        this.jarRepository = jarRepository;
        this.objectMapper = objectMapper;
        this.executionLogRepository = executionLogRepository;
    }

    public ExecuteJavaServiceResponse execute(
            String serviceId,
            ExecuteJavaServiceRequest request) {

        JavaService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "JavaService not found: " + serviceId));

        List<Object> arguments =
                request == null || request.arguments() == null
                        ? List.of()
                        : request.arguments();

        long started = System.nanoTime();

        try {

            if (!service.isEnabled()) {
                throw new BadRequestException(
                        "JavaService is disabled: "
                                + service.getServiceName());
            }

            JarDefinition jar = jarRepository.findById(service.getJarId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "JAR definition not found: "
                                    + service.getJarId()));

            Path jarPath = Path.of(jar.getStoragePath());

            if (!Files.exists(jarPath)) {
                throw new ResourceNotFoundException(
                        "Stored JAR file not found: " + jar.getId());
            }

            List<JavaService.Parameter> parameters =
                    service.getParameters() == null
                            ? List.of()
                            : service.getParameters();

            if (arguments.size() != parameters.size()) {
                throw new BadRequestException(
                        "Expected " + parameters.size()
                                + " argument(s), but received "
                                + arguments.size());
            }

            try (URLClassLoader classLoader =
                         new URLClassLoader(
                                 new URL[]{jarPath.toUri().toURL()},
                                 JavaServiceExecutor.class
                                         .getClassLoader())) {

                Class<?> clazz = Class.forName(
                        service.getClassName(),
                        false,
                        classLoader);

                if (!Modifier.isPublic(clazz.getModifiers())) {
                    throw new BadRequestException(
                            "Selected class is not public: "
                                    + service.getClassName());
                }

                Class<?>[] parameterTypes =
                        resolveParameterTypes(
                                parameters,
                                classLoader);

                Method method = clazz.getDeclaredMethod(
                        service.getMethodName(),
                        parameterTypes);

                if (!Modifier.isPublic(method.getModifiers())) {
                    throw new BadRequestException(
                            "Selected method is not public: "
                                    + service.getMethodName());
                }

                Object[] convertedArguments =
                        new Object[arguments.size()];

                for (int i = 0; i < arguments.size(); i++) {

                    convertedArguments[i] =
                            objectMapper.convertValue(
                                    arguments.get(i),
                                    objectMapper.constructType(
                                            parameterTypes[i]));
                }

                Object target = null;

                if (!Modifier.isStatic(method.getModifiers())) {

                    Constructor<?> constructor =
                            clazz.getDeclaredConstructor();

                    if (!Modifier.isPublic(
                            constructor.getModifiers())) {

                        throw new BadRequestException(
                                "Instance method requires a public "
                                        + "no-argument constructor: "
                                        + clazz.getName());
                    }

                    target = constructor.newInstance();
                }

                method.setAccessible(true);

                Object result = method.invoke(
                        target,
                        convertedArguments);

                long elapsed =
                        (System.nanoTime() - started)
                                / 1_000_000;

                ExecuteJavaServiceResponse response =
                        new ExecuteJavaServiceResponse(
                                service.getId(),
                                service.getServiceName(),
                                service.getClassName(),
                                service.getMethodName(),
                                result,
                                result == null
                                        ? "null"
                                        : result.getClass().getName(),
                                elapsed
                        );

                saveExecutionLog(
                        service,
                        arguments,
                        result,
                        response.resultType(),
                        "SUCCESS",
                        null,
                        elapsed
                );

                return response;
            }

        /*
         * IMPORTANT:
         * IllegalArgumentException must come BEFORE
         * RuntimeException because IllegalArgumentException
         * extends RuntimeException.
         */
        } catch (IllegalArgumentException e) {

            BadRequestException ex =
                    new BadRequestException(
                            "Invalid argument value: "
                                    + e.getMessage());

            saveFailure(
                    service,
                    arguments,
                    ex,
                    started);

            throw ex;

        } catch (RuntimeException e) {

            saveFailure(
                    service,
                    arguments,
                    e,
                    started);

            throw e;

        } catch (ClassNotFoundException e) {

            BadRequestException ex =
                    new BadRequestException(
                            "Class not found in JAR: "
                                    + service.getClassName());

            saveFailure(
                    service,
                    arguments,
                    ex,
                    started);

            throw ex;

        } catch (NoSuchMethodException e) {

            BadRequestException ex =
                    new BadRequestException(
                            "Selected method or public no-argument "
                                    + "constructor was not found: "
                                    + service.getMethodName());

            saveFailure(
                    service,
                    arguments,
                    ex,
                    started);

            throw ex;

        } catch (InvocationTargetException e) {

            Throwable target = e.getTargetException();

            BadRequestException ex =
                    new BadRequestException(
                            "Java method threw an exception: "
                                    + target.getClass().getName()
                                    + (target.getMessage() == null
                                    ? ""
                                    : " - " + target.getMessage()));

            saveFailure(
                    service,
                    arguments,
                    ex,
                    started);

            throw ex;

        } catch (ReflectiveOperationException | IOException e) {

            BadRequestException ex =
                    new BadRequestException(
                            "Unable to execute JavaService: "
                                    + e.getMessage());

            saveFailure(
                    service,
                    arguments,
                    ex,
                    started);

            throw ex;

        } catch (LinkageError e) {

            BadRequestException ex =
                    new BadRequestException(
                            "Unable to load service dependencies: "
                                    + e.getMessage());

            saveFailure(
                    service,
                    arguments,
                    ex,
                    started);

            throw ex;
        }
    }

    private void saveFailure(
            JavaService service,
            List<Object> arguments,
            Exception error,
            long started) {

        saveExecutionLog(
                service,
                arguments,
                null,
                null,
                "FAILED",
                error.getMessage(),
                (System.nanoTime() - started)
                        / 1_000_000
        );
    }

    private void saveExecutionLog(
            JavaService service,
            List<Object> arguments,
            Object response,
            String responseType,
            String status,
            String errorMessage,
            long executionTimeMs) {

        JavaServiceExecutionLog log =
                new JavaServiceExecutionLog();

        log.setServiceId(service.getId());
        log.setServiceName(service.getServiceName());
        log.setEndpointPath(service.getEndpointPath());
        log.setClassName(service.getClassName());
        log.setMethodName(service.getMethodName());
        log.setRequestArguments(arguments);
        log.setResponse(response);
        log.setResponseType(responseType);
        log.setStatus(status);
        log.setErrorMessage(errorMessage);
        log.setExecutionTimeMs(executionTimeMs);
        log.setExecutedAt(Instant.now());

        executionLogRepository.save(log);
    }

    private Class<?>[] resolveParameterTypes(
            List<JavaService.Parameter> parameters,
            ClassLoader classLoader)
            throws ClassNotFoundException {

        Class<?>[] result =
                new Class<?>[parameters.size()];

        for (int i = 0; i < parameters.size(); i++) {

            result[i] = resolveType(
                    parameters.get(i).getType(),
                    classLoader);
        }

        return result;
    }

    private Class<?> resolveType(
            String type,
            ClassLoader classLoader)
            throws ClassNotFoundException {

        return switch (type) {

            case "byte" -> byte.class;

            case "short" -> short.class;

            case "int" -> int.class;

            case "long" -> long.class;

            case "float" -> float.class;

            case "double" -> double.class;

            case "boolean" -> boolean.class;

            case "char" -> char.class;

            case "void" -> void.class;

            default -> {

                if (type.endsWith("[]")) {

                    Class<?> component =
                            resolveType(
                                    type.substring(
                                            0,
                                            type.length() - 2),
                                    classLoader);

                    yield java.lang.reflect.Array
                            .newInstance(
                                    component,
                                    0)
                            .getClass();
                }

                yield Class.forName(
                        type,
                        false,
                        classLoader);
            }
        };
    }
}