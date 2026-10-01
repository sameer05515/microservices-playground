package com.iagent.javaservice.dto;

public record ExecuteJavaServiceResponse(
        String serviceId,
        String serviceName,
        String className,
        String methodName,
        Object result,
        String resultType,
        long executionTimeMs
) {
}
