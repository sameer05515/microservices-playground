package com.p.exceptionhandling.service;

import com.p.exceptionhandling.dto.UserRequest;
import com.p.exceptionhandling.dto.UserResponse;
import com.p.exceptionhandling.exception.BusinessLogicException;
import com.p.exceptionhandling.exception.InvalidEmailException;
import com.p.exceptionhandling.exception.ResourceNotFoundException;
import com.p.exceptionhandling.validation.EmailValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * User Service
 * 
 * This service demonstrates how to throw custom exceptions
 * that will be handled by the GlobalExceptionHandler.
 */
@Slf4j
@Service
public class UserService {
	
	// In-memory storage for demonstration
	private final Map<Long, UserResponse> users = new ConcurrentHashMap<>();
	private final AtomicLong idGenerator = new AtomicLong(1);
	
	/**
	 * Create a new user
	 * 
	 * Demonstrates:
	 * 1. Custom exception throwing (InvalidEmailException)
	 * 2. Dynamic parameters in exception
	 */
	public UserResponse createUser(UserRequest request) {
		log.info("Creating user with email: {}", request.getEmail());
		
		// Validate email format using custom validator
		if (!EmailValidator.isValid(request.getEmail())) {
			String reason = EmailValidator.getValidationMessage(request.getEmail());
			throw new InvalidEmailException(request.getEmail(), reason)
				.withParameter("field", "email")
				.withParameter("providedValue", request.getEmail());
		}
		
		// Check for duplicate email
		boolean emailExists = users.values().stream()
			.anyMatch(user -> user.getEmail().equalsIgnoreCase(request.getEmail()));
		
		if (emailExists) {
			throw new BusinessLogicException(
				String.format("User with email '%s' already exists", request.getEmail()),
				"UNIQUE_EMAIL_REQUIRED")
				.withParameter("email", request.getEmail())
				.withParameter("conflictingField", "email");
		}
		
		// Check for duplicate username
		boolean usernameExists = users.values().stream()
			.anyMatch(user -> user.getUsername().equalsIgnoreCase(request.getUsername()));
		
		if (usernameExists) {
			throw new BusinessLogicException(
				String.format("Username '%s' is already taken", request.getUsername()),
				"UNIQUE_USERNAME_REQUIRED")
				.withParameter("username", request.getUsername())
				.withParameter("conflictingField", "username");
		}
		
		// Create user
		UserResponse user = UserResponse.builder()
			.id(idGenerator.getAndIncrement())
			.username(request.getUsername())
			.email(request.getEmail())
			.firstName(request.getFirstName())
			.lastName(request.getLastName())
			.age(request.getAge())
			.createdAt(LocalDateTime.now())
			.build();
		
		users.put(user.getId(), user);
		log.info("User created successfully with ID: {}", user.getId());
		
		return user;
	}
	
	/**
	 * Get user by ID
	 * 
	 * Demonstrates ResourceNotFoundException
	 */
	public UserResponse getUserById(Long id) {
		log.info("Fetching user with ID: {}", id);
		
		UserResponse user = users.get(id);
		if (user == null) {
			throw new ResourceNotFoundException("User", id)
				.withParameter("searchedId", id)
				.withParameter("availableIds", new ArrayList<>(users.keySet()));
		}
		
		return user;
	}
	
	/**
	 * Get user by email
	 * 
	 * Demonstrates:
	 * 1. InvalidEmailException for invalid email format
	 * 2. ResourceNotFoundException for not found
	 */
	public UserResponse getUserByEmail(String email) {
		log.info("Fetching user with email: {}", email);
		
		// Validate email format
		if (!EmailValidator.isValid(email)) {
			throw new InvalidEmailException(email)
				.withParameter("field", "email")
				.withParameter("searchType", "email");
		}
		
		UserResponse user = users.values().stream()
			.filter(u -> u.getEmail().equalsIgnoreCase(email))
			.findFirst()
			.orElse(null);
		
		if (user == null) {
			throw new ResourceNotFoundException("User", email)
				.withParameter("searchType", "email")
				.withParameter("searchedEmail", email);
		}
		
		return user;
	}
	
	/**
	 * Get all users
	 */
	public List<UserResponse> getAllUsers() {
		log.info("Fetching all users");
		return new ArrayList<>(users.values());
	}
	
	/**
	 * Delete user by ID
	 * 
	 * Demonstrates BusinessLogicException
	 */
	public void deleteUser(Long id) {
		log.info("Deleting user with ID: {}", id);
		
		UserResponse user = users.get(id);
		if (user == null) {
			throw new ResourceNotFoundException("User", id);
		}
		
		// Simulate business rule: Cannot delete user if they have active orders
		// This is a demonstration of business logic validation
		boolean hasActiveOrders = checkIfUserHasActiveOrders(id);
		if (hasActiveOrders) {
			throw new BusinessLogicException(
				String.format("Cannot delete user with ID %d because they have active orders", id),
				"USER_HAS_ACTIVE_ORDERS")
				.withParameter("userId", id)
				.withParameter("reason", "Active orders exist")
				.withParameter("action", "Please cancel or complete all orders before deleting the user");
		}
		
		users.remove(id);
		log.info("User deleted successfully: {}", id);
	}
	
	/**
	 * Simulate checking for active orders
	 */
	private boolean checkIfUserHasActiveOrders(Long userId) {
		// Simulate: user with ID 1 has active orders
		return userId == 1L;
	}
}

