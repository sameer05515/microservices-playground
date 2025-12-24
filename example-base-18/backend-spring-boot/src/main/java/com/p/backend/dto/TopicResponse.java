package com.p.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicResponse {
    private String id;
    private String title;
    private String content;
    private String directoryId;
    private String directoryName;
    private String path; // Full path for display
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

