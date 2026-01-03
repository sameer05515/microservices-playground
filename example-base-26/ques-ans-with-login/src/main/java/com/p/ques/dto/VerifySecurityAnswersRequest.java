package com.p.ques.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record VerifySecurityAnswersRequest(
        @NotBlank @Email String email,
        @NotNull @Size(min = 2, max = 2)
        List<@Valid SecurityAnswer> answers
) {
    public record SecurityAnswer(
            @NotBlank String questionId,
            @NotBlank @Size(min = 1, max = 200) String answer
    ) {}
}
