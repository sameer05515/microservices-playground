package com.prem.fileutils.model;

import jakarta.validation.constraints.NotBlank;

public record OperationRequest(
        @NotBlank String source,
        String destination
) {
}
