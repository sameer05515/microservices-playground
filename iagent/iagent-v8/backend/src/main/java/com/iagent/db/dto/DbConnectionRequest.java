package com.iagent.db.dto;

import jakarta.validation.constraints.NotBlank;

public record DbConnectionRequest(
        @NotBlank String name,
        @NotBlank String jdbcUrl,
        @NotBlank String username,
        @NotBlank String password) {
}
