package com.p.abstractfactory.controller;

import com.p.abstractfactory.model.User;
import com.p.abstractfactory.service.DatabaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller demonstrating the Abstract Factory Pattern usage
 */
@RestController
@RequestMapping("/api/database")
public class DatabaseController {
	
	private final DatabaseService databaseService;
	
	public DatabaseController(DatabaseService databaseService) {
		this.databaseService = databaseService;
	}
	
	/**
	 * Get information about the current database type
	 */
	@GetMapping("/info")
	public ResponseEntity<Map<String, Object>> getDatabaseInfo() {
		Map<String, Object> info = new HashMap<>();
		info.put("databaseType", databaseService.getDatabaseType());
		info.put("connectionStatus", databaseService.testConnection() ? "Connected" : "Disconnected");
		return ResponseEntity.ok(info);
	}
	
	/**
	 * Test database connection
	 */
	@GetMapping("/test-connection")
	public ResponseEntity<Map<String, Object>> testConnection() {
		boolean connected = databaseService.testConnection();
		Map<String, Object> response = new HashMap<>();
		response.put("connected", connected);
		response.put("databaseType", databaseService.getDatabaseType());
		response.put("message", connected ? "Connection successful" : "Connection failed");
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Create a new user
	 */
	@PostMapping("/users")
	public ResponseEntity<User> createUser(@RequestBody User user) {
		User savedUser = databaseService.saveUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}
	
	/**
	 * Get user by ID
	 */
	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		Optional<User> user = databaseService.findUserById(id);
		return user.map(ResponseEntity::ok)
			.orElse(ResponseEntity.notFound().build());
	}
	
	/**
	 * Get all users
	 */
	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = databaseService.findAllUsers();
		return ResponseEntity.ok(users);
	}
	
	/**
	 * Delete user by ID
	 */
	@DeleteMapping("/users/{id}")
	public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
		databaseService.deleteUser(id);
		Map<String, String> response = new HashMap<>();
		response.put("message", "User deleted successfully");
		response.put("id", id.toString());
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Get user count
	 */
	@GetMapping("/users/count")
	public ResponseEntity<Map<String, Object>> getUserCount() {
		long count = databaseService.countUsers();
		Map<String, Object> response = new HashMap<>();
		response.put("count", count);
		response.put("databaseType", databaseService.getDatabaseType());
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Execute operations in a transaction
	 */
	@PostMapping("/transaction")
	public ResponseEntity<Map<String, String>> executeTransaction(@RequestBody List<User> users) {
		try {
			databaseService.executeInTransaction(() -> {
				for (User user : users) {
					databaseService.saveUser(user);
				}
			});
			Map<String, String> response = new HashMap<>();
			response.put("message", "Transaction executed successfully");
			response.put("usersSaved", String.valueOf(users.size()));
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, String> response = new HashMap<>();
			response.put("message", "Transaction failed: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
}

