package com.p.exceptionhandling.controller;

import com.p.exceptionhandling.dto.UserRequest;
import com.p.exceptionhandling.dto.UserResponse;
import com.p.exceptionhandling.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Controller
 * 
 * This controller demonstrates exception handling in action.
 * Notice that there are NO try-catch blocks - all exceptions
 * are handled by the GlobalExceptionHandler.
 * 
 * The @Valid annotation triggers validation, and any validation
 * errors are automatically handled by the global exception handler.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	
	/**
	 * Create a new user
	 * 
	 * This endpoint demonstrates:
	 * 1. @Valid annotation for automatic validation
	 * 2. Custom exception throwing (InvalidEmailException, BusinessLogicException)
	 * 3. All exceptions are handled by GlobalExceptionHandler
	 */
	@PostMapping
	public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
		// No try-catch needed - exceptions are handled globally
		UserResponse user = userService.createUser(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}
	
	/**
	 * Get user by ID
	 * 
	 * Demonstrates ResourceNotFoundException
	 */
	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
		UserResponse user = userService.getUserById(id);
		return ResponseEntity.ok(user);
	}
	
	/**
	 * Get user by email
	 * 
	 * Demonstrates:
	 * 1. InvalidEmailException for invalid email format
	 * 2. ResourceNotFoundException for not found
	 */
	@GetMapping("/email/{email}")
	public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
		UserResponse user = userService.getUserByEmail(email);
		return ResponseEntity.ok(user);
	}
	
	/**
	 * Get all users
	 */
	@GetMapping
	public ResponseEntity<List<UserResponse>> getAllUsers() {
		List<UserResponse> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}
	
	/**
	 * Delete user by ID
	 * 
	 * Demonstrates:
	 * 1. ResourceNotFoundException for not found
	 * 2. BusinessLogicException for business rule violations
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}
}

