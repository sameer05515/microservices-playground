package com.p.builder.controller;

import com.p.builder.builder.FluentApiResponseBuilder;
import com.p.builder.builder.StepBuilder;
import com.p.builder.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * REST Controller demonstrating Builder Pattern advantages
 * 
 * This controller shows different ways to build complex API responses
 * and compares them with traditional approaches.
 */
@RestController
@RequestMapping("/api/builder")
public class BuilderPatternController {
	
	/**
	 * Example 1: Simple success response using Builder
	 * 
	 * Advantage: Clean, readable, immutable
	 */
	@GetMapping("/simple-success")
	public ResponseEntity<ApiResponse<User>> simpleSuccess() {
		User user = User.builder()
			.id(1L)
			.username("johndoe")
			.email("john@example.com")
			.firstName("John")
			.lastName("Doe")
			.active(true)
			.build();
		
		ApiResponse<User> response = ApiResponse.success(user);
		
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Example 2: Complex response with many optional fields
	 * 
	 * Advantage: Only set what you need, clear intent
	 */
	@GetMapping("/complex-response")
	public ResponseEntity<ApiResponse<User>> complexResponse() {
		User user = User.builder()
			.id(1L)
			.username("johndoe")
			.email("john@example.com")
			.firstName("John")
			.lastName("Doe")
			.address(Address.builder()
				.street("123 Main St")
				.city("New York")
				.state("NY")
				.zipCode("10001")
				.country("USA")
				.build())
			.roles(Arrays.asList("USER", "ADMIN"))
			.createdAt(LocalDateTime.now())
			.active(true)
			.build();
		
		ApiResponse<User> response = ApiResponse.<User>builder()
			.status("success")
			.statusCode(200)
			.message("User retrieved successfully")
			.data(user)
			.metadata(Map.of(
				"version", "1.0",
				"requestId", "req-12345"
			))
			.links(Arrays.asList(
				Link.builder().rel("self").href("/api/users/1").method("GET").build(),
				Link.builder().rel("update").href("/api/users/1").method("PUT").build()
			))
			.build();
		
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Example 3: Paginated response using Fluent Builder
	 * 
	 * Advantage: Fluent API, method chaining, self-documenting
	 */
	@GetMapping("/paginated")
	public ResponseEntity<ApiResponse<User>> paginatedResponse(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		
		// Simulate data
		List<User> users = Arrays.asList(
			User.builder().id(1L).username("user1").email("user1@example.com").build(),
			User.builder().id(2L).username("user2").email("user2@example.com").build()
		);
		
		ApiResponse<User> response = FluentApiResponseBuilder.<User>success()
			.withMessage("Users retrieved successfully")
			.withItems(users)
			.withPagination(page, size, 25) // total = 25
			.withMetadata("sortBy", "username")
			.withLink("self", "/api/users?page=" + page, "GET")
			.withLink("next", "/api/users?page=" + (page + 1), "GET")
			.build();
		
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Example 4: Error response using Builder
	 * 
	 * Advantage: Consistent error format, easy to extend
	 */
	@GetMapping("/error-example")
	public ResponseEntity<ApiResponse<Void>> errorExample() {
		ApiResponse<Void> response = ApiResponse.<Void>builder()
			.status("error")
			.statusCode(404)
			.message("Resource not found")
			.error(ErrorInfo.builder()
				.message("User with ID 999 not found")
				.code("USER_NOT_FOUND")
				.details(Arrays.asList(
					"User ID: 999",
					"Timestamp: " + LocalDateTime.now()
				))
				.build())
			.build();
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}
	
	/**
	 * Example 5: Step Builder Pattern
	 * 
	 * Advantage: Guided building, type-safe steps, prevents invalid states
	 */
	@GetMapping("/step-builder-example")
	public ResponseEntity<ApiResponse<User>> stepBuilderExample() {
		User user = User.builder()
			.id(1L)
			.username("johndoe")
			.email("john@example.com")
			.build();
		
		ApiResponse<?> response = StepBuilder.newBuilder()
			.success()
			.withDefaultStatus()
			.withDefaultStatusCode()
			.withMessage("User created successfully")
			.withData(user)
			.withMetadata("version", "1.0")
			.withLink("self", "/api/users/1", "GET")
			.build();
		
		return ResponseEntity.status(HttpStatus.CREATED).body((ApiResponse<User>) response);
	}
	
	/**
	 * Example 6: Comparison - Without Builder (Traditional Approach)
	 * 
	 * This shows how messy it gets without Builder Pattern
	 */
	@GetMapping("/without-builder")
	public ResponseEntity<Map<String, Object>> withoutBuilder() {
		// Without Builder: Need to create map manually, easy to make mistakes
		Map<String, Object> response = new java.util.HashMap<>();
		response.put("status", "success");
		response.put("statusCode", 200);
		response.put("message", "Operation successful");
		
		Map<String, Object> user = new java.util.HashMap<>();
		user.put("id", 1L);
		user.put("username", "johndoe");
		user.put("email", "john@example.com");
		response.put("data", user);
		
		// Problems:
		// 1. Not type-safe
		// 2. Easy to make typos in keys
		// 3. No validation
		// 4. Not immutable
		// 5. Hard to maintain
		
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Example 7: Nested complex object with Builder
	 * 
	 * Advantage: Handles nested objects elegantly
	 */
	@GetMapping("/nested-complex")
	public ResponseEntity<ApiResponse<User>> nestedComplex() {
		User user = User.builder()
			.id(1L)
			.username("johndoe")
			.email("john@example.com")
			.firstName("John")
			.lastName("Doe")
			.address(Address.builder()
				.street("123 Main St")
				.city("New York")
				.state("NY")
				.zipCode("10001")
				.country("USA")
				.build())
			.roles(Arrays.asList("USER", "ADMIN", "MODERATOR"))
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.active(true)
			.build();
		
		ApiResponse<User> response = FluentApiResponseBuilder.<User>success()
			.withMessage("User with full details retrieved")
			.withData(user)
			.withMetadata("includeAddress", true)
			.withMetadata("includeRoles", true)
			.withLink("self", "/api/users/1", "GET")
			.withLink("update", "/api/users/1", "PUT")
			.withLink("delete", "/api/users/1", "DELETE")
			.build();
		
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Example 8: Conditional building
	 * 
	 * Advantage: Easy to conditionally add fields
	 */
	@GetMapping("/conditional")
	public ResponseEntity<ApiResponse<User>> conditional(
			@RequestParam(required = false) boolean includeAddress,
			@RequestParam(required = false) boolean includeRoles) {
		
		User.UserBuilder userBuilder = User.builder()
			.id(1L)
			.username("johndoe")
			.email("john@example.com");
		
		if (includeAddress) {
			userBuilder.address(Address.builder()
				.street("123 Main St")
				.city("New York")
				.build());
		}
		
		if (includeRoles) {
			userBuilder.roles(Arrays.asList("USER", "ADMIN"));
		}
		
		User user = userBuilder.build();
		
		FluentApiResponseBuilder<User> responseBuilder = FluentApiResponseBuilder.<User>success()
			.withData(user);
		
		if (includeAddress) {
			responseBuilder.withMetadata("includeAddress", true);
		}
		
		if (includeRoles) {
			responseBuilder.withMetadata("includeRoles", true);
		}
		
		return ResponseEntity.ok(responseBuilder.build());
	}
}

