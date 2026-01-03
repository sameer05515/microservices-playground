package com.p.abstractfactory.product;

/**
 * Abstract Product: Transaction
 * 
 * Represents a database transaction manager. Each database type has different
 * transaction semantics (ACID for SQL databases, eventual consistency for MongoDB).
 */
public interface Transaction {
	
	/**
	 * Begins a new transaction
	 */
	void begin();
	
	/**
	 * Commits the current transaction
	 */
	void commit();
	
	/**
	 * Rolls back the current transaction
	 */
	void rollback();
	
	/**
	 * Checks if a transaction is active
	 * @return true if transaction is active, false otherwise
	 */
	boolean isActive();
	
	/**
	 * Executes operations within a transaction
	 * @param operations Runnable containing operations to execute
	 * @throws Exception if transaction fails
	 */
	void executeInTransaction(Runnable operations) throws Exception;
	
	/**
	 * Gets the database type
	 * @return database type name
	 */
	String getDatabaseType();
}

