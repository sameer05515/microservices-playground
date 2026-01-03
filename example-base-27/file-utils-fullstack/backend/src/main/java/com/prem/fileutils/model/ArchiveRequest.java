package com.prem.fileutils.model;

import jakarta.validation.constraints.NotBlank;

public record ArchiveRequest(
        @NotBlank String source,
        @NotBlank String destination
) {
}
