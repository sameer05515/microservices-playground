package com.p.exceptionhandling.exception;

import org.springframework.http.HttpStatus;

/**
 * Custom Exception for Invalid Email Format
 * 
 * This exception is thrown when a user provides an invalid email format.
 * It extends BaseException to inherit:
 * - HTTP status code (BAD_REQUEST)
 * - Error code (INVALID_EMAIL)
 * - Dynamic parameters (e.g., the invalid email value)
 * - Timestamp
 */
public class InvalidEmailException extends BaseException {
	
	private static final HttpStatus HTTP_STATUS = HttpStatus.BAD_REQUEST;
	private static final String ERROR_CODE = "INVALID_EMAIL";
	
	public InvalidEmailException(String email) {
		super(HTTP_STATUS, ERROR_CODE, 
			String.format("Invalid email format: '%s'", email));
		// Add the invalid email as a parameter for flexibility
		this.withParameter("email", email);
		this.withParameter("expectedFormat", "user@example.com");
	}
	
	public InvalidEmailException(String email, String reason) {
		super(HTTP_STATUS, ERROR_CODE, 
			String.format("Invalid email format: '%s'. Reason: %s", email, reason));
		this.withParameter("email", email);
		this.withParameter("reason", reason);
		this.withParameter("expectedFormat", "user@example.com");
	}
}

