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
public class TopicRequest {
    @NotBlank(message = "Topic title is required")
    private String title;

    private String content;

    @NotBlank(message = "Directory ID is required")
    private String directoryId;
}

