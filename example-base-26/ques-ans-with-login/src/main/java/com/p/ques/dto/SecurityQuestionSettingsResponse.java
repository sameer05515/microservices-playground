package com.p.ques.dto;

import java.util.List;

public record SecurityQuestionSettingsResponse(
        List<ConfiguredQuestion> questions
) {
    public record ConfiguredQuestion(
            String questionId,
            String question
    ) {}
}
