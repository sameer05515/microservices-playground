package com.iagent.db.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateDbServiceRequest(
        @NotBlank String serviceName,
        @NotBlank String connectionId,
        @NotBlank String query,
        Boolean enabled) {
}
