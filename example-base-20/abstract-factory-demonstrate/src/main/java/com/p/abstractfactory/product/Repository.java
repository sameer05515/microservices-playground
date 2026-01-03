package com.p.abstractfactory.product;

import java.util.List;
import java.util.Optional;

/**
 * Abstract Product: Repository
 * 
 * Defines the interface for data access operations. Each concrete implementation
 * will use the appropriate database-specific APIs (JDBC for SQL databases,
 * MongoTemplate for MongoDB, etc.)
 */
public interface Repository<T, ID> {
	
	/**
	 * Saves an entity to the database
	 * @param entity entity to save
	 * @return saved entity
	 */
	T save(T entity);
	
	/**
	 * Finds an entity by ID
	 * @param id entity ID
	 * @return Optional containing the entity if found
	 */
	Optional<T> findById(ID id);
	
	/**
	 * Finds all entities
	 * @return list of all entities
	 */
	List<T> findAll();
	
	/**
	 * Deletes an entity by ID
	 * @param id entity ID
	 */
	void deleteById(ID id);
	
	/**
	 * Checks if an entity exists by ID
	 * @param id entity ID
	 * @return true if exists, false otherwise
	 */
	boolean existsById(ID id);
	
	/**
	 * Counts total number of entities
	 * @return total count
	 */
	long count();
	
	/**
	 * Gets the database type this repository works with
	 * @return database type name
	 */
	String getDatabaseType();
}

