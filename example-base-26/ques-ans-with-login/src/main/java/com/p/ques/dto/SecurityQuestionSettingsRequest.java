package com.p.ques.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SecurityQuestionSettingsRequest(
        @NotNull
        @Size(min = 2, max = 2)
        List<@Valid SecurityQuestionAnswerRequest> questions
) {
    public record SecurityQuestionAnswerRequest(
            @NotBlank String questionId,
            @NotBlank @Size(min = 1, max = 200) String answer
    ) {}
}
