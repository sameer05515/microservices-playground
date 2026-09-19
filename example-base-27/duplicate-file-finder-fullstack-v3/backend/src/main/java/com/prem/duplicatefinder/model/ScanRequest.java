package com.prem.duplicatefinder.model;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ScanRequest(
        @NotBlank String rootPath,
        List<String> ignoredFolders
) {
    public List<String> normalizedIgnoredFolders() {
        if (ignoredFolders == null) return List.of();
        return ignoredFolders.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .toList();
    }
}
