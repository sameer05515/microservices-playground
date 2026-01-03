package com.p.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateQuestionRequest {
    @NotBlank(message = "Question text is required")
    private String questionText;

    private String description;

    private String answer;

    @Builder.Default
    private List<String> tags = new ArrayList<>();
}

