package com.p.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectoryResponse {
    private String id;
    private String name;
    private String description;
    private String parentId;
    private String parentName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long subDirectoryCount;
    private long topicCount;
    private List<DirectoryResponse> children; // For hierarchy view
    private String path; // Full path for display
}

