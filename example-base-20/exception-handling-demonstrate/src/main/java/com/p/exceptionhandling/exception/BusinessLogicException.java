package com.p.exceptionhandling.exception;

import org.springframework.http.HttpStatus;

/**
 * Custom Exception for Business Logic Violations
 * 
 * This exception is thrown when business rules are violated.
 * Example: Trying to delete a user that has active orders.
 */
public class BusinessLogicException extends BaseException {
	
	private static final HttpStatus HTTP_STATUS = HttpStatus.UNPROCESSABLE_ENTITY;
	private static final String ERROR_CODE = "BUSINESS_LOGIC_ERROR";
	
	public BusinessLogicException(String message) {
		super(HTTP_STATUS, ERROR_CODE, message);
	}
	
	public BusinessLogicException(String message, String businessRule) {
		super(HTTP_STATUS, ERROR_CODE, message);
		this.withParameter("businessRule", businessRule);
	}
	
	public BusinessLogicException(String message, Map<String, Object> context) {
		super(HTTP_STATUS, ERROR_CODE, message);
		this.withParameters(context);
	}
}

