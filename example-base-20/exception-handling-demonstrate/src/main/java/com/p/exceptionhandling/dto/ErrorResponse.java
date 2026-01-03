package com.p.exceptionhandling.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Custom Error Response DTO
 * 
 * This is the standardized error response structure returned to clients.
 * 
 * Design Features:
 * 1. Consistent structure across all error responses
 * 2. Dynamic parameters (Map<String, Object>) for flexibility
 * 3. Error code for programmatic handling
 * 4. Human-readable message
 * 5. Timestamp for debugging
 * 6. Path information for identifying the endpoint
 * 
 * @JsonInclude(JsonInclude.Include.NON_NULL) ensures that null fields
 * are not included in the JSON response, keeping it clean.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
	
	/**
	 * HTTP status code (e.g., 400, 404, 500)
	 */
	private int status;
	
	/**
	 * Error code for programmatic handling (e.g., "INVALID_EMAIL", "RESOURCE_NOT_FOUND")
	 */
	private String errorCode;
	
	/**
	 * Human-readable error message
	 */
	private String message;
	
	/**
	 * Dynamic parameters - allows flexibility to add any key-value pairs
	 * Examples:
	 * - {"email": "invalid@", "expectedFormat": "user@example.com"}
	 * - {"resourceType": "User", "resourceId": "123"}
	 * - {"fieldErrors": {"email": "Invalid format", "age": "Must be positive"}}
	 */
	private Map<String, Object> parameters;
	
	/**
	 * Timestamp when the error occurred
	 */
	private LocalDateTime timestamp;
	
	/**
	 * API path where the error occurred (useful for debugging)
	 */
	private String path;
	
	/**
	 * Stack trace (only in development mode)
	 */
	private String stackTrace;
}

