package com.p.abstractfactory.service;

import com.p.abstractfactory.factory.impl.MongoDBFactory;
import com.p.abstractfactory.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Database Service Tests")
class DatabaseServiceTest {
	
	private DatabaseService databaseService;
	
	@BeforeEach
	void setUp() {
		// Use MongoDB factory for testing (in-memory implementation)
		MongoDBFactory factory = new MongoDBFactory(
			"mongodb://localhost:27017",
			"test"
		);
		databaseService = new DatabaseService(factory);
	}
	
	@Test
	@DisplayName("Service should return correct database type")
	void testGetDatabaseType() {
		assertEquals("MongoDB", databaseService.getDatabaseType());
	}
	
	@Test
	@DisplayName("Service should save and retrieve users")
	void testSaveAndRetrieveUser() {
		User user = new User(null, "John Doe", "john@example.com");
		
		User savedUser = databaseService.saveUser(user);
		assertNotNull(savedUser.getId());
		assertEquals("John Doe", savedUser.getName());
		
		Optional<User> foundUser = databaseService.findUserById(savedUser.getId());
		assertTrue(foundUser.isPresent());
		assertEquals(savedUser.getId(), foundUser.get().getId());
		assertEquals("John Doe", foundUser.get().getName());
	}
	
	@Test
	@DisplayName("Service should find all users")
	void testFindAllUsers() {
		databaseService.saveUser(new User(null, "User 1", "user1@example.com"));
		databaseService.saveUser(new User(null, "User 2", "user2@example.com"));
		
		List<User> users = databaseService.findAllUsers();
		assertTrue(users.size() >= 2);
	}
	
	@Test
	@DisplayName("Service should delete users")
	void testDeleteUser() {
		User user = databaseService.saveUser(new User(null, "To Delete", "delete@example.com"));
		Long userId = user.getId();
		
		databaseService.deleteUser(userId);
		
		Optional<User> deletedUser = databaseService.findUserById(userId);
		assertFalse(deletedUser.isPresent());
	}
	
	@Test
	@DisplayName("Service should count users")
	void testCountUsers() {
		long initialCount = databaseService.countUsers();
		
		databaseService.saveUser(new User(null, "New User", "new@example.com"));
		
		long newCount = databaseService.countUsers();
		assertEquals(initialCount + 1, newCount);
	}
}

