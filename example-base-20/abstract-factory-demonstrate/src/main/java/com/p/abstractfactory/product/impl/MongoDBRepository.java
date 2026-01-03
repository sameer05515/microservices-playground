package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.model.User;
import com.p.abstractfactory.product.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Concrete Product: MongoDB Repository
 * 
 * Note: This is a simplified in-memory implementation for demonstration.
 * In a real application, you'd use MongoTemplate or MongoRepository from Spring Data MongoDB.
 */
public class MongoDBRepository implements Repository<User, Long> {
	
	private static final Logger logger = LoggerFactory.getLogger(MongoDBRepository.class);
	private final String connectionString;
	private final String databaseName;
	
	// In-memory storage for demonstration (in real app, this would be MongoDB)
	private final ConcurrentHashMap<Long, User> storage = new ConcurrentHashMap<>();
	private final AtomicLong idGenerator = new AtomicLong(1);
	
	public MongoDBRepository(String connectionString, String databaseName) {
		this.connectionString = connectionString;
		this.databaseName = databaseName;
		logger.info("MongoDB repository initialized for database: {}", databaseName);
	}
	
	@Override
	public User save(User entity) {
		if (entity.getId() == null) {
			entity.setId(idGenerator.getAndIncrement());
		}
		storage.put(entity.getId(), entity);
		logger.info("User saved in MongoDB: {}", entity);
		return entity;
	}
	
	@Override
	public Optional<User> findById(Long id) {
		User user = storage.get(id);
		return Optional.ofNullable(user);
	}
	
	@Override
	public List<User> findAll() {
		return new ArrayList<>(storage.values());
	}
	
	@Override
	public void deleteById(Long id) {
		storage.remove(id);
		logger.info("User deleted from MongoDB: id={}", id);
	}
	
	@Override
	public boolean existsById(Long id) {
		return storage.containsKey(id);
	}
	
	@Override
	public long count() {
		return storage.size();
	}
	
	@Override
	public String getDatabaseType() {
		return "MongoDB";
	}
}

