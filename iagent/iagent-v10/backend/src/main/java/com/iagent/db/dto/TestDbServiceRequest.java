package com.iagent.db.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record TestDbServiceRequest(
        @NotBlank String connectionId,
        @NotBlank String query,
        Map<String, Object> parameters) {
}
