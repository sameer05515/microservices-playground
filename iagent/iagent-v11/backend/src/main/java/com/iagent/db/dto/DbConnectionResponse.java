package com.iagent.db.dto;

import java.time.Instant;

public record DbConnectionResponse(
        String id,
        String name,
        String jdbcUrl,
        String username,
        Instant createdAt,
        Instant updatedAt) {
}
