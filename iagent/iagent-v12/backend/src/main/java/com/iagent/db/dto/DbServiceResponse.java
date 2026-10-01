package com.iagent.db.dto;
import java.time.Instant;
import java.util.List;
public record DbServiceResponse(
        String id, String serviceName, String connectionId, String connectionName,
        String query, List<String> parameterNames, String endpointPath,
        boolean enabled, Instant createdAt, Instant updatedAt) {}
