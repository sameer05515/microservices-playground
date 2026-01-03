package com.p.exceptionhandling.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Base Exception Class
 * 
 * This is the foundation for all custom exceptions in the application.
 * It provides:
 * - HTTP status code
 * - Error message
 * - Dynamic parameters (key-value pairs)
 * - Timestamp
 * 
 * This design allows for:
 * 1. Consistent error structure across all exceptions
 * 2. Dynamic parameter passing (flexibility)
 * 3. Easy extension for new exception types
 * 4. Centralized error information
 */
public abstract class BaseException extends RuntimeException {
	
	private final HttpStatus httpStatus;
	private final String errorCode;
	private final Map<String, Object> parameters;
	private final LocalDateTime timestamp;
	
	protected BaseException(HttpStatus httpStatus, String errorCode, String message) {
		super(message);
		this.httpStatus = httpStatus;
		this.errorCode = errorCode;
		this.parameters = new HashMap<>();
		this.timestamp = LocalDateTime.now();
	}
	
	protected BaseException(HttpStatus httpStatus, String errorCode, String message, Throwable cause) {
		super(message, cause);
		this.httpStatus = httpStatus;
		this.errorCode = errorCode;
		this.parameters = new HashMap<>();
		this.timestamp = LocalDateTime.now();
	}
	
	/**
	 * Add dynamic parameter to the exception
	 * This allows flexibility to add any key-value pair
	 * 
	 * @param key parameter key
	 * @param value parameter value
	 * @return this exception for method chaining
	 */
	public BaseException withParameter(String key, Object value) {
		this.parameters.put(key, value);
		return this;
	}
	
	/**
	 * Add multiple parameters at once
	 */
	public BaseException withParameters(Map<String, Object> parameters) {
		this.parameters.putAll(parameters);
		return this;
	}
	
	// Getters
	public HttpStatus getHttpStatus() {
		return httpStatus;
	}
	
	public String getErrorCode() {
		return errorCode;
	}
	
	public Map<String, Object> getParameters() {
		return new HashMap<>(parameters); // Return copy for immutability
	}
	
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
}

