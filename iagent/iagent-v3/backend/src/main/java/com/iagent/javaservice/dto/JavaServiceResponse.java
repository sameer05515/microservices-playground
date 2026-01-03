package com.iagent.javaservice.dto;

import com.iagent.javaservice.model.JavaService;
import java.time.Instant;
import java.util.List;

public record JavaServiceResponse(
        String id, String serviceName, String description, boolean enabled,
        String jarId, String jarFileName, String className, String methodName,
        String returnType, List<JavaService.Parameter> parameters, Instant createdAt
) {}
