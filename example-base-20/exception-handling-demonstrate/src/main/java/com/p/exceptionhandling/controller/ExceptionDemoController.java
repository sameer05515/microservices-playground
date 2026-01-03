package com.p.exceptionhandling.controller;

import com.p.exceptionhandling.exception.BusinessLogicException;
import com.p.exceptionhandling.exception.InvalidEmailException;
import com.p.exceptionhandling.exception.ResourceNotFoundException;
import com.p.exceptionhandling.exception.ValidationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Exception Demo Controller
 * 
 * This controller provides endpoints to demonstrate different
 * exception types and how they are handled.
 */
@RestController
@RequestMapping("/api/demo/exceptions")
public class ExceptionDemoController {
	
	/**
	 * Demonstrate InvalidEmailException
	 */
	@GetMapping("/invalid-email")
	public ResponseEntity<String> demonstrateInvalidEmail(@RequestParam String email) {
		// This will throw InvalidEmailException if email is invalid
		// The GlobalExceptionHandler will catch it and return a proper ErrorResponse
		throw new InvalidEmailException(email)
			.withParameter("field", "email")
			.withParameter("example", "user@example.com");
	}
	
	/**
	 * Demonstrate InvalidEmailException with custom reason
	 */
	@GetMapping("/invalid-email-with-reason")
	public ResponseEntity<String> demonstrateInvalidEmailWithReason(@RequestParam String email) {
		throw new InvalidEmailException(email, "Missing domain part")
			.withParameter("field", "email")
			.withParameter("issue", "domain")
			.withParameter("expectedFormat", "user@example.com");
	}
	
	/**
	 * Demonstrate ResourceNotFoundException
	 */
	@GetMapping("/not-found")
	public ResponseEntity<String> demonstrateNotFound(@RequestParam String resourceType, 
	                                                   @RequestParam String resourceId) {
		throw new ResourceNotFoundException(resourceType, resourceId)
			.withParameter("searchedAt", System.currentTimeMillis())
			.withParameter("suggestion", "Please check the ID and try again");
	}
	
	/**
	 * Demonstrate ValidationException with single field
	 */
	@GetMapping("/validation-single")
	public ResponseEntity<String> demonstrateValidationSingle() {
		throw new ValidationException(
			"Validation failed",
			"age",
			"Age must be between 18 and 120")
			.withParameter("validationType", "range");
	}
	
	/**
	 * Demonstrate ValidationException with multiple fields
	 */
	@GetMapping("/validation-multiple")
	public ResponseEntity<String> demonstrateValidationMultiple() {
		throw new ValidationException(
			"Multiple validation errors",
			Map.of(
				"email", "Invalid email format",
				"age", "Age must be positive",
				"username", "Username already exists"
			))
			.withParameter("totalErrors", 3);
	}
	
	/**
	 * Demonstrate BusinessLogicException
	 */
	@GetMapping("/business-logic")
	public ResponseEntity<String> demonstrateBusinessLogic() {
		throw new BusinessLogicException(
			"Cannot perform this operation due to business rules",
			Map.of(
				"rule", "USER_HAS_ACTIVE_ORDERS",
				"userId", 123,
				"activeOrders", 5,
				"action", "Please complete or cancel all orders first"
			));
	}
	
	/**
	 * Demonstrate IllegalArgumentException
	 */
	@GetMapping("/illegal-argument")
	public ResponseEntity<String> demonstrateIllegalArgument(@RequestParam(required = false) String value) {
		if (value == null || value.trim().isEmpty()) {
			throw new IllegalArgumentException("Value parameter is required and cannot be empty");
		}
		return ResponseEntity.ok("Value: " + value);
	}
}

