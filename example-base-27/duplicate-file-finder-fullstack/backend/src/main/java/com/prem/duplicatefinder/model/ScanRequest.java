package com.prem.duplicatefinder.model;

import jakarta.validation.constraints.NotBlank;

public record ScanRequest(@NotBlank String rootPath) {}
