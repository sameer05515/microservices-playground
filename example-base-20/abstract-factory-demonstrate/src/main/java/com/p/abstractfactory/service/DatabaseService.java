package com.p.abstractfactory.service;

import com.p.abstractfactory.factory.DatabaseFactory;
import com.p.abstractfactory.model.User;
import com.p.abstractfactory.product.Connection;
import com.p.abstractfactory.product.Repository;
import com.p.abstractfactory.product.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class that uses the Abstract Factory Pattern
 * 
 * This service doesn't know about concrete database implementations.
 * It works with the abstract interfaces (DatabaseFactory, Connection, Repository, Transaction),
 * making it easy to switch between different database types.
 */
@Service
public class DatabaseService {
	
	private static final Logger logger = LoggerFactory.getLogger(DatabaseService.class);
	private final DatabaseFactory databaseFactory;
	
	public DatabaseService(DatabaseFactory databaseFactory) {
		this.databaseFactory = databaseFactory;
		logger.info("DatabaseService initialized with factory: {}", databaseFactory.getDatabaseType());
	}
	
	/**
	 * Gets the database type being used
	 */
	public String getDatabaseType() {
		return databaseFactory.getDatabaseType();
	}
	
	/**
	 * Tests the database connection
	 */
	public boolean testConnection() {
		Connection connection = databaseFactory.createConnection();
		boolean connected = connection.connect();
		if (connected) {
			connection.disconnect();
		}
		return connected;
	}
	
	/**
	 * Saves a user to the database
	 */
	public User saveUser(User user) {
		Repository<User, Long> repository = databaseFactory.createRepository();
		return repository.save(user);
	}
	
	/**
	 * Finds a user by ID
	 */
	public Optional<User> findUserById(Long id) {
		Repository<User, Long> repository = databaseFactory.createRepository();
		return repository.findById(id);
	}
	
	/**
	 * Finds all users
	 */
	public List<User> findAllUsers() {
		Repository<User, Long> repository = databaseFactory.createRepository();
		return repository.findAll();
	}
	
	/**
	 * Deletes a user by ID
	 */
	public void deleteUser(Long id) {
		Repository<User, Long> repository = databaseFactory.createRepository();
		repository.deleteById(id);
	}
	
	/**
	 * Counts total users
	 */
	public long countUsers() {
		Repository<User, Long> repository = databaseFactory.createRepository();
		return repository.count();
	}
	
	/**
	 * Executes multiple operations in a transaction
	 */
	public void executeInTransaction(Runnable operations) throws Exception {
		Transaction transaction = databaseFactory.createTransaction();
		transaction.executeInTransaction(operations);
	}
}

