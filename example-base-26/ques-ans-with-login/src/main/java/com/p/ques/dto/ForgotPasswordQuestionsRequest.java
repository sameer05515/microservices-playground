package com.p.ques.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordQuestionsRequest(
        @NotBlank @Email String email
) {
}
