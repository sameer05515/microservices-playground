package com.iagent.javaservice.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.jar.model.JarDefinition;
import com.iagent.jar.repository.JarDefinitionRepository;
import com.iagent.javaservice.dto.CreateJavaServiceRequest;
import com.iagent.javaservice.dto.JavaServiceResponse;
import com.iagent.javaservice.model.JavaService;
import com.iagent.javaservice.repository.JavaServiceRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class JavaServiceManager {
    private final JavaServiceRepository repository;
    private final JarDefinitionRepository jarRepository;

    public JavaServiceManager(JavaServiceRepository repository, JarDefinitionRepository jarRepository) {
        this.repository = repository;
        this.jarRepository = jarRepository;
    }

    public JavaServiceResponse create(CreateJavaServiceRequest request) {
        JarDefinition jar = jarRepository.findById(request.jarId())
                .orElseThrow(() -> new ResourceNotFoundException("JAR definition not found: " + request.jarId()));
        if (request.serviceName().isBlank()) throw new BadRequestException("serviceName is required");

        JavaService service = new JavaService(
                null, request.serviceName().trim(), request.description(),
                request.enabled() == null || request.enabled(), jar.getId(), jar.getFileName(),
                request.className(), request.methodName(), request.returnType(),
                request.parameters() == null ? List.of() : request.parameters().stream()
                        .map(p -> new JavaService.Parameter(p.name(), p.type())).toList(), Instant.now(),
                request.httpMethod() == null || request.httpMethod().isBlank() ? "POST" : request.httpMethod().trim().toUpperCase(),
                normalizeEndpoint(request.endpointPath(), request.serviceName())
        );
        return toResponse(repository.save(service));
    }

    public List<JavaServiceResponse> getAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    private String normalizeEndpoint(String endpointPath, String serviceName) {
        String value = endpointPath == null || endpointPath.isBlank()
                ? serviceName.trim().replaceAll("[^a-zA-Z0-9]+", "-").replaceAll("^-|-$", "").toLowerCase()
                : endpointPath.trim();
        if (value.isBlank()) throw new BadRequestException("endpointPath is required");
        if (!value.startsWith("/")) value = "/" + value;
        if (value.contains(" ")) throw new BadRequestException("endpointPath must not contain spaces");
        return value;
    }

    private JavaServiceResponse toResponse(JavaService s) {
        return new JavaServiceResponse(s.getId(), s.getServiceName(), s.getDescription(), s.isEnabled(),
                s.getJarId(), s.getJarFileName(), s.getClassName(), s.getMethodName(), s.getReturnType(),
                s.getParameters(), s.getCreatedAt(), s.getHttpMethod(), s.getEndpointPath());
    }
}
