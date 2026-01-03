package com.p.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @Email(message = "Email must be valid")
    private String email;
}

