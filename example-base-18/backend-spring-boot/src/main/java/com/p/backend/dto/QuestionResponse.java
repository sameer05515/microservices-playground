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
public class QuestionResponse {
    private String id;
    private String questionText;
    private String description;
    private String answer;
    private List<String> tags;
    private String directoryId;
    private String directoryName;
    private String topicId;
    private String topicName;
    private String parentType;
    private String parentId;
    private String parentName;
    private String path; // Full path for display
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

