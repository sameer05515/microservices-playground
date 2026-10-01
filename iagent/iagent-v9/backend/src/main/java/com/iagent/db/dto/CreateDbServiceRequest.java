package com.iagent.db.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record CreateDbServiceRequest(
        @NotBlank String serviceName,
        @NotBlank String connectionId,
        @NotBlank String query,
        Boolean enabled,
        Map<String, Object> parameters) {
}
