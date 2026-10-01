package com.iagent.db.dto;

import java.util.List;

public record DbQueryResponse(
        String serviceId,
        String serviceName,
        boolean resultSet,
        List<String> columns,
        List<List<Object>> rows,
        int rowCount,
        int updateCount,
        long executionTimeMs) {
}
