package com.p.exceptionhandling.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

/**
 * Custom Exception for Validation Errors
 * 
 * This exception handles multiple validation errors at once.
 * Useful for form validation where multiple fields may have errors.
 */
public class ValidationException extends BaseException {
	
	private static final HttpStatus HTTP_STATUS = HttpStatus.BAD_REQUEST;
	private static final String ERROR_CODE = "VALIDATION_ERROR";
	
	public ValidationException(String message) {
		super(HTTP_STATUS, ERROR_CODE, message);
	}
	
	public ValidationException(String message, Map<String, String> fieldErrors) {
		super(HTTP_STATUS, ERROR_CODE, message);
		this.withParameter("fieldErrors", fieldErrors);
	}
	
	public ValidationException(String message, String field, String error) {
		super(HTTP_STATUS, ERROR_CODE, message);
		this.withParameter("fieldErrors", Map.of(field, error));
	}
}

