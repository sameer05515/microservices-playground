package com.p.ques.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTodoRequest(

        @NotBlank
        @Size(max = 500)
        String title

) {
}