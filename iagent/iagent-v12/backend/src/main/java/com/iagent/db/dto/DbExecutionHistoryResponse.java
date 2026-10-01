package com.iagent.db.dto;
import java.time.Instant;
import java.util.Map;
public record DbExecutionHistoryResponse(
        String id, String serviceId, String serviceName, String endpointPath,
        String connectionName, String query, Map<String,Object> requestParameters,
        Object response, boolean resultSet, int rowCount, int updateCount,
        String status, String errorMessage, long executionTimeMs, Instant executedAt) {}
