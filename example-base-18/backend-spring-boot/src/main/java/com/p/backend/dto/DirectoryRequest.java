package com.p.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectoryRequest {
    @NotBlank(message = "Directory name is required")
    private String name;

    private String description;

    private String parentId; // Optional - null for root directory
}

