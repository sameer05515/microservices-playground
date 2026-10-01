package com.iagent.db.dto;

import java.time.Instant;

public record DbServiceResponse(
        String id,
        String serviceName,
        String connectionId,
        String query,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt) {
}
