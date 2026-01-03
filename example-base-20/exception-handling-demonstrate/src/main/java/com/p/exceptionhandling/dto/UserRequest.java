package com.p.exceptionhandling.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Request DTO
 * 
 * Demonstrates validation annotations that work with
 * the global exception handler.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
	
	@NotBlank(message = "Username is required")
	@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
	private String username;
	
	@NotBlank(message = "Email is required")
	@Email(message = "Email format is invalid")
	private String email;
	
	@NotBlank(message = "First name is required")
	@Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
	private String firstName;
	
	@NotBlank(message = "Last name is required")
	@Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
	private String lastName;
	
	@NotNull(message = "Age is required")
	private Integer age;
}

