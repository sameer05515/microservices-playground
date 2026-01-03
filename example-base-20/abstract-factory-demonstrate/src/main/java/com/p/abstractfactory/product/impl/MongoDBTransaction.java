package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.product.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Concrete Product: MongoDB Transaction
 * 
 * Note: MongoDB supports transactions starting from version 4.0,
 * but they work differently than SQL transactions (multi-document ACID transactions).
 * This is a simplified implementation for demonstration.
 */
public class MongoDBTransaction implements Transaction {
	
	private static final Logger logger = LoggerFactory.getLogger(MongoDBTransaction.class);
	private final String connectionString;
	private final String databaseName;
	private boolean active = false;
	
	public MongoDBTransaction(String connectionString, String databaseName) {
		this.connectionString = connectionString;
		this.databaseName = databaseName;
	}
	
	@Override
	public void begin() {
		// In a real application, you'd start a MongoDB session here
		active = true;
		logger.info("MongoDB transaction begun (simulated)");
	}
	
	@Override
	public void commit() {
		if (active) {
			// In a real application, you'd commit the MongoDB session here
			active = false;
			logger.info("MongoDB transaction committed (simulated)");
		}
	}
	
	@Override
	public void rollback() {
		if (active) {
			// In a real application, you'd abort the MongoDB session here
			active = false;
			logger.info("MongoDB transaction rolled back (simulated)");
		}
	}
	
	@Override
	public boolean isActive() {
		return active;
	}
	
	@Override
	public void executeInTransaction(Runnable operations) throws Exception {
		begin();
		try {
			operations.run();
			commit();
		} catch (Exception e) {
			rollback();
			throw e;
		}
	}
	
	@Override
	public String getDatabaseType() {
		return "MongoDB";
	}
}

