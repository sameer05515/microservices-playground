package com.prem.fileutils.model;

import jakarta.validation.constraints.NotBlank;

public record OperationRequest(
        @NotBlank String source,
        @NotBlank String destination
) {
}
