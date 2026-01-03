package com.p.exceptionhandling.exception;

import org.springframework.http.HttpStatus;

/**
 * Custom Exception for Resource Not Found
 * 
 * Demonstrates how to extend BaseException for different scenarios.
 * This exception is thrown when a requested resource cannot be found.
 */
public class ResourceNotFoundException extends BaseException {
	
	private static final HttpStatus HTTP_STATUS = HttpStatus.NOT_FOUND;
	private static final String ERROR_CODE = "RESOURCE_NOT_FOUND";
	
	public ResourceNotFoundException(String resourceType, Object resourceId) {
		super(HTTP_STATUS, ERROR_CODE, 
			String.format("%s with ID '%s' not found", resourceType, resourceId));
		this.withParameter("resourceType", resourceType);
		this.withParameter("resourceId", resourceId);
	}
	
	public ResourceNotFoundException(String resourceType, Object resourceId, String additionalInfo) {
		super(HTTP_STATUS, ERROR_CODE, 
			String.format("%s with ID '%s' not found. %s", resourceType, resourceId, additionalInfo));
		this.withParameter("resourceType", resourceType);
		this.withParameter("resourceId", resourceId);
		this.withParameter("additionalInfo", additionalInfo);
	}
}

