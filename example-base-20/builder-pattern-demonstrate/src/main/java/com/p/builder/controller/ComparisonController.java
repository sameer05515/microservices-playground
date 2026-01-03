package com.p.builder.controller;

import com.p.builder.model.ApiResponse;
import com.p.builder.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller demonstrating the advantages of Builder Pattern
 * by comparing different approaches side-by-side
 */
@RestController
@RequestMapping("/api/comparison")
public class ComparisonController {
	
	/**
	 * Comparison: Constructor Approach
	 * 
	 * Problems:
	 * - Too many parameters (hard to remember order)
	 * - All parameters required (even if null)
	 * - Not readable (what does each parameter mean?)
	 * - Error-prone (easy to swap parameters)
	 */
	@GetMapping("/constructor-approach")
	public ResponseEntity<Map<String, Object>> constructorApproach() {
		// This is what you'd have to do without Builder:
		// User user = new User(1L, "johndoe", "john@example.com", "John", "Doe", 
		//     null, null, null, null, null, false);
		// Hard to read, easy to make mistakes!
		
		Map<String, Object> result = new HashMap<>();
		result.put("approach", "Constructor");
		result.put("problems", new String[]{
			"Too many parameters",
			"Hard to remember order",
			"All parameters required",
			"Not readable",
			"Error-prone"
		});
		result.put("example", "new User(1L, \"johndoe\", \"john@example.com\", \"John\", \"Doe\", null, null, null, null, null, false)");
		
		return ResponseEntity.ok(result);
	}
	
	/**
	 * Comparison: Setter Approach
	 * 
	 * Problems:
	 * - Not immutable (can be modified after creation)
	 * - Can forget to set required fields
	 * - No validation during construction
	 * - Verbose code
	 */
	@GetMapping("/setter-approach")
	public ResponseEntity<Map<String, Object>> setterApproach() {
		Map<String, Object> result = new HashMap<>();
		result.put("approach", "Setters");
		result.put("problems", new String[]{
			"Not immutable",
			"Can forget required fields",
			"No validation",
			"Verbose code",
			"Can be modified after creation"
		});
		result.put("example", 
			"User user = new User();\n" +
			"user.setId(1L);\n" +
			"user.setUsername(\"johndoe\");\n" +
			"// ... many more setters");
		
		return ResponseEntity.ok(result);
	}
	
	/**
	 * Comparison: Builder Approach
	 * 
	 * Advantages:
	 * - Fluent API (readable)
	 * - Immutable
	 * - Optional parameters handled elegantly
	 * - Validation possible
	 * - Self-documenting
	 */
	@GetMapping("/builder-approach")
	public ResponseEntity<ApiResponse<Map<String, Object>>> builderApproach() {
		User user = User.builder()
			.id(1L)
			.username("johndoe")
			.email("john@example.com")
			.firstName("John")
			.lastName("Doe")
			// Optional fields can be omitted
			.build();
		
		Map<String, Object> advantages = new HashMap<>();
		advantages.put("approach", "Builder Pattern");
		advantages.put("advantages", new String[]{
			"Fluent API - readable code",
			"Immutable objects",
			"Optional parameters handled elegantly",
			"Validation possible",
			"Self-documenting",
			"Type-safe",
			"IDE autocomplete support"
		});
		advantages.put("example", 
			"User user = User.builder()\n" +
			"    .id(1L)\n" +
			"    .username(\"johndoe\")\n" +
			"    .email(\"john@example.com\")\n" +
			"    .build();");
		advantages.put("user", user);
		
		return ResponseEntity.ok(ApiResponse.success(advantages));
	}
	
	/**
	 * Side-by-side comparison
	 */
	@GetMapping("/side-by-side")
	public ResponseEntity<Map<String, Object>> sideBySide() {
		Map<String, Object> comparison = new HashMap<>();
		
		// Constructor approach
		comparison.put("constructor", Map.of(
			"readability", "Poor",
			"immutability", "Yes",
			"optionalParams", "No",
			"validation", "No",
			"linesOfCode", "1 (but unreadable)"
		));
		
		// Setter approach
		comparison.put("setters", Map.of(
			"readability", "Medium",
			"immutability", "No",
			"optionalParams", "Yes",
			"validation", "No",
			"linesOfCode", "Many"
		));
		
		// Builder approach
		comparison.put("builder", Map.of(
			"readability", "Excellent",
			"immutability", "Yes",
			"optionalParams", "Yes",
			"validation", "Yes",
			"linesOfCode", "Few (but readable)"
		));
		
		return ResponseEntity.ok(comparison);
	}
}

