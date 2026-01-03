package com.p.exceptionhandling.handler;

import com.p.exceptionhandling.dto.ErrorResponse;
import com.p.exceptionhandling.exception.BaseException;
import com.p.exceptionhandling.exception.BusinessLogicException;
import com.p.exceptionhandling.exception.InvalidEmailException;
import com.p.exceptionhandling.exception.ResourceNotFoundException;
import com.p.exceptionhandling.exception.ValidationException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global Exception Handler
 * 
 * This class uses @ControllerAdvice to handle exceptions across the entire application.
 * 
 * Design Approach:
 * 1. Centralized Exception Handling: All exceptions are handled in one place
 * 2. Consistent Error Response: All errors return the same ErrorResponse structure
 * 3. Specific Handlers: Each exception type has its own handler method
 * 4. Fallback Handler: Generic handler for unexpected exceptions
 * 5. Dynamic Parameters: ErrorResponse supports flexible parameter passing
 * 
 * Benefits:
 * - No need to add try-catch in every controller
 * - Consistent error format across all endpoints
 * - Easy to add new exception types
 * - Centralized logging
 * - Easy to customize error responses
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
	
	/**
	 * Handle custom BaseException and its subclasses
	 * 
	 * This is a generic handler that works for all custom exceptions
	 * that extend BaseException. It demonstrates the power of inheritance
	 * in exception handling.
	 */
	@ExceptionHandler(BaseException.class)
	public ResponseEntity<ErrorResponse> handleBaseException(
			BaseException ex, 
			HttpServletRequest request) {
		
		log.error("BaseException occurred: {}", ex.getMessage(), ex);
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(ex.getHttpStatus().value())
			.errorCode(ex.getErrorCode())
			.message(ex.getMessage())
			.parameters(ex.getParameters())
			.timestamp(ex.getTimestamp())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(ex.getHttpStatus())
			.body(errorResponse);
	}
	
	/**
	 * Handle InvalidEmailException specifically
	 * 
	 * This demonstrates how you can have specific handlers for specific exceptions
	 * if you need custom logic. Otherwise, the BaseException handler above
	 * will handle it.
	 */
	@ExceptionHandler(InvalidEmailException.class)
	public ResponseEntity<ErrorResponse> handleInvalidEmailException(
			InvalidEmailException ex,
			HttpServletRequest request) {
		
		log.warn("Invalid email provided: {}", ex.getParameters().get("email"));
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(ex.getHttpStatus().value())
			.errorCode(ex.getErrorCode())
			.message(ex.getMessage())
			.parameters(ex.getParameters())
			.timestamp(ex.getTimestamp())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(ex.getHttpStatus())
			.body(errorResponse);
	}
	
	/**
	 * Handle ResourceNotFoundException
	 */
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
			ResourceNotFoundException ex,
			HttpServletRequest request) {
		
		log.warn("Resource not found: {}", ex.getMessage());
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(ex.getHttpStatus().value())
			.errorCode(ex.getErrorCode())
			.message(ex.getMessage())
			.parameters(ex.getParameters())
			.timestamp(ex.getTimestamp())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(ex.getHttpStatus())
			.body(errorResponse);
	}
	
	/**
	 * Handle ValidationException
	 */
	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(
			ValidationException ex,
			HttpServletRequest request) {
		
		log.warn("Validation error: {}", ex.getMessage());
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(ex.getHttpStatus().value())
			.errorCode(ex.getErrorCode())
			.message(ex.getMessage())
			.parameters(ex.getParameters())
			.timestamp(ex.getTimestamp())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(ex.getHttpStatus())
			.body(errorResponse);
	}
	
	/**
	 * Handle BusinessLogicException
	 */
	@ExceptionHandler(BusinessLogicException.class)
	public ResponseEntity<ErrorResponse> handleBusinessLogicException(
			BusinessLogicException ex,
			HttpServletRequest request) {
		
		log.warn("Business logic violation: {}", ex.getMessage());
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(ex.getHttpStatus().value())
			.errorCode(ex.getErrorCode())
			.message(ex.getMessage())
			.parameters(ex.getParameters())
			.timestamp(ex.getTimestamp())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(ex.getHttpStatus())
			.body(errorResponse);
	}
	
	/**
	 * Handle Spring's MethodArgumentNotValidException
	 * 
	 * This handles validation errors from @Valid annotations
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
			MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		
		log.warn("Validation failed: {}", ex.getMessage());
		
		Map<String, String> fieldErrors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach(error -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			fieldErrors.put(fieldName, errorMessage);
		});
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(HttpStatus.BAD_REQUEST.value())
			.errorCode("VALIDATION_ERROR")
			.message("Validation failed for the provided data")
			.parameters(Map.of("fieldErrors", fieldErrors))
			.timestamp(LocalDateTime.now())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(HttpStatus.BAD_REQUEST)
			.body(errorResponse);
	}
	
	/**
	 * Handle ConstraintViolationException
	 * 
	 * This handles validation errors from method-level validation
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(
			ConstraintViolationException ex,
			HttpServletRequest request) {
		
		log.warn("Constraint violation: {}", ex.getMessage());
		
		Map<String, String> violations = ex.getConstraintViolations().stream()
			.collect(Collectors.toMap(
				violation -> violation.getPropertyPath().toString(),
				ConstraintViolation::getMessage
			));
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(HttpStatus.BAD_REQUEST.value())
			.errorCode("CONSTRAINT_VIOLATION")
			.message("Constraint validation failed")
			.parameters(Map.of("violations", violations))
			.timestamp(LocalDateTime.now())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(HttpStatus.BAD_REQUEST)
			.body(errorResponse);
	}
	
	/**
	 * Handle IllegalArgumentException
	 */
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgument(
			IllegalArgumentException ex,
			HttpServletRequest request) {
		
		log.warn("Illegal argument: {}", ex.getMessage());
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.status(HttpStatus.BAD_REQUEST.value())
			.errorCode("ILLEGAL_ARGUMENT")
			.message(ex.getMessage())
			.timestamp(LocalDateTime.now())
			.path(request.getRequestURI())
			.build();
		
		return ResponseEntity
			.status(HttpStatus.BAD_REQUEST)
			.body(errorResponse);
	}
	
	/**
	 * Fallback handler for all other exceptions
	 * 
	 * This catches any unexpected exceptions that don't have specific handlers.
	 * It's important to have this to ensure the API always returns a proper response.
	 */
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ResponseEntity<ErrorResponse> handleGenericException(
			Exception ex,
			HttpServletRequest request) {
		
		log.error("Unexpected error occurred", ex);
		
		ErrorResponse.ErrorResponseBuilder builder = ErrorResponse.builder()
			.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
			.errorCode("INTERNAL_SERVER_ERROR")
			.message("An unexpected error occurred")
			.timestamp(LocalDateTime.now())
			.path(request.getRequestURI());
		
		// Only include stack trace in development
		// In production, you might want to exclude this
		if (isDevelopmentMode()) {
			builder.stackTrace(getStackTrace(ex));
		}
		
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(builder.build());
	}
	
	/**
	 * Check if application is in development mode
	 */
	private boolean isDevelopmentMode() {
		String profile = System.getProperty("spring.profiles.active", "");
		return profile.contains("dev") || profile.contains("development");
	}
	
	/**
	 * Get stack trace as string
	 */
	private String getStackTrace(Exception ex) {
		java.io.StringWriter sw = new java.io.StringWriter();
		java.io.PrintWriter pw = new java.io.PrintWriter(sw);
		ex.printStackTrace(pw);
		return sw.toString();
	}
}

