package com.p.abstractfactory.factory;

import com.p.abstractfactory.product.Connection;
import com.p.abstractfactory.product.Repository;
import com.p.abstractfactory.product.Transaction;

/**
 * Abstract Factory Interface
 * 
 * This is the core of the Abstract Factory Pattern. It defines methods to create
 * families of related objects (Connection, Repository, Transaction) without
 * specifying their concrete classes.
 * 
 * Each concrete factory (MySQLFactory, PostgreSQLFactory, MongoDBFactory) will
 * implement this interface and create products that are compatible with each other.
 * 
 * Benefits:
 * - Ensures products from the same factory are compatible
 * - Isolates concrete classes from clients
 * - Makes it easy to add new database types
 * - Promotes consistency across product families
 */
public interface DatabaseFactory {
	
	/**
	 * Creates a database connection appropriate for the database type
	 * @return Connection instance
	 */
	Connection createConnection();
	
	/**
	 * Creates a repository for data access operations
	 * @return Repository instance
	 */
	Repository createRepository();
	
	/**
	 * Creates a transaction manager for the database type
	 * @return Transaction instance
	 */
	Transaction createTransaction();
	
	/**
	 * Gets the database type this factory supports
	 * @return Database type name
	 */
	String getDatabaseType();
}

