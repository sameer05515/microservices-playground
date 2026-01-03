package com.p.ques.dto;

import java.util.List;

public record ForgotPasswordQuestionsResponse(
        List<SecurityQuestion> questions
) {
    public record SecurityQuestion(
            String questionId,
            String question
    ) {}
}
