package com.iagent.javaservice.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreateJavaServiceRequest(
        @NotBlank String serviceName,
        String description,
        Boolean enabled,
        @NotBlank String jarId,
        @NotBlank String className,
        @NotBlank String methodName,
        String returnType,
        List<ParameterRequest> parameters,
        String httpMethod,
        String endpointPath
) {
    public record ParameterRequest(String name, String type) {}
}
