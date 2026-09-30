package com.iagent.javaservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iagent.common.BadRequestException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.jar.model.JarDefinition;
import com.iagent.jar.repository.JarDefinitionRepository;
import com.iagent.javaservice.dto.ExecuteJavaServiceRequest;
import com.iagent.javaservice.dto.ExecuteJavaServiceResponse;
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
import java.util.List;

@Service
public class JavaServiceExecutor {

    private final JavaServiceRepository serviceRepository;
    private final JarDefinitionRepository jarRepository;
    private final ObjectMapper objectMapper;

    public JavaServiceExecutor(
            JavaServiceRepository serviceRepository,
            JarDefinitionRepository jarRepository,
            ObjectMapper objectMapper) {
        this.serviceRepository = serviceRepository;
        this.jarRepository = jarRepository;
        this.objectMapper = objectMapper;
    }

    public ExecuteJavaServiceResponse execute(String serviceId, ExecuteJavaServiceRequest request) {
        JavaService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("JavaService not found: " + serviceId));

        if (!service.isEnabled()) {
            throw new BadRequestException("JavaService is disabled: " + service.getServiceName());
        }

        JarDefinition jar = jarRepository.findById(service.getJarId())
                .orElseThrow(() -> new ResourceNotFoundException("JAR definition not found: " + service.getJarId()));

        Path jarPath = Path.of(jar.getStoragePath());
        if (!Files.exists(jarPath)) {
            throw new ResourceNotFoundException("Stored JAR file not found: " + jar.getId());
        }

        List<Object> arguments = request == null || request.arguments() == null
                ? List.of()
                : request.arguments();

        List<JavaService.Parameter> parameters = service.getParameters() == null
                ? List.of()
                : service.getParameters();

        if (arguments.size() != parameters.size()) {
            throw new BadRequestException(
                    "Expected " + parameters.size() + " argument(s), but received " + arguments.size());
        }

        long started = System.nanoTime();

        try (URLClassLoader classLoader = new URLClassLoader(
                new URL[]{jarPath.toUri().toURL()},
                JavaServiceExecutor.class.getClassLoader())) {

            Class<?> clazz = Class.forName(service.getClassName(), false, classLoader);
            if (!Modifier.isPublic(clazz.getModifiers())) {
                throw new BadRequestException("Selected class is not public: " + service.getClassName());
            }

            Class<?>[] parameterTypes = resolveParameterTypes(parameters, classLoader);
            Method method = findMethod(clazz, service.getMethodName(), parameterTypes);

            if (!Modifier.isPublic(method.getModifiers())) {
                throw new BadRequestException("Selected method is not public: " + service.getMethodName());
            }

            Object[] convertedArguments = new Object[arguments.size()];
            for (int i = 0; i < arguments.size(); i++) {
                convertedArguments[i] = objectMapper.convertValue(arguments.get(i),
                        objectMapper.constructType(parameterTypes[i]));
            }

            Object target = null;
            if (!Modifier.isStatic(method.getModifiers())) {
                Constructor<?> constructor = clazz.getDeclaredConstructor();
                if (!Modifier.isPublic(constructor.getModifiers())) {
                    throw new BadRequestException(
                            "Instance method requires a public no-argument constructor: " + clazz.getName());
                }
                target = constructor.newInstance();
            }

            method.setAccessible(true);
            Object result = method.invoke(target, convertedArguments);

            long elapsed = (System.nanoTime() - started) / 1_000_000;
            return new ExecuteJavaServiceResponse(
                    service.getId(),
                    service.getServiceName(),
                    service.getClassName(),
                    service.getMethodName(),
                    result,
                    result == null ? "null" : result.getClass().getName(),
                    elapsed
            );

        } catch (ClassNotFoundException e) {
            throw new ResourceNotFoundException("Class not found in JAR: " + service.getClassName());
        } catch (NoSuchMethodException e) {
            throw new BadRequestException("A public no-argument constructor is required for this instance service: " + service.getClassName());
        } catch (InvocationTargetException e) {
            Throwable target = e.getTargetException();
            throw new BadRequestException("Java method threw an exception: " + target.getClass().getName()
                    + (target.getMessage() == null ? "" : " - " + target.getMessage()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid argument value: " + e.getMessage());
        } catch (ReflectiveOperationException | IOException e) {
            throw new BadRequestException("Unable to execute JavaService: " + e.getMessage());
        } catch (LinkageError e) {
            throw new BadRequestException("Unable to load service dependencies: " + e.getMessage());
        }
    }

    private Class<?>[] resolveParameterTypes(List<JavaService.Parameter> parameters, ClassLoader classLoader)
            throws ClassNotFoundException {
        Class<?>[] result = new Class<?>[parameters.size()];
        for (int i = 0; i < parameters.size(); i++) {
            result[i] = resolveType(parameters.get(i).getType(), classLoader);
        }
        return result;
    }

    private Class<?> resolveType(String type, ClassLoader classLoader) throws ClassNotFoundException {
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
                    Class<?> component = resolveType(type.substring(0, type.length() - 2), classLoader);
                    yield java.lang.reflect.Array.newInstance(component, 0).getClass();
                }
                yield Class.forName(type, false, classLoader);
            }
        };
    }

    private Method findMethod(Class<?> clazz, String name, Class<?>[] parameterTypes) throws NoSuchMethodException {
        Method method = clazz.getDeclaredMethod(name, parameterTypes);
        if (!Modifier.isPublic(method.getModifiers())) {
            throw new NoSuchMethodException(name);
        }
        return method;
    }
}
