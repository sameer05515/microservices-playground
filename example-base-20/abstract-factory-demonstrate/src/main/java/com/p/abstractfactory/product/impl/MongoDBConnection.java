package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.product.Connection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Concrete Product: MongoDB Connection
 * 
 * Note: MongoDB uses a different connection model than SQL databases.
 * In a real application, you'd use MongoClient from the MongoDB Java driver.
 */
public class MongoDBConnection implements Connection {
	
	private static final Logger logger = LoggerFactory.getLogger(MongoDBConnection.class);
	private final String connectionString;
	private final String databaseName;
	private boolean connected = false;
	
	public MongoDBConnection(String connectionString, String databaseName) {
		this.connectionString = connectionString;
		this.databaseName = databaseName;
	}
	
	@Override
	public boolean connect() {
		// In a real application, you'd create a MongoClient here
		// This is simplified for demonstration
		try {
			// Simulate connection
			connected = true;
			logger.info("MongoDB connection established: {} / {}", connectionString, databaseName);
			return true;
		} catch (Exception e) {
			logger.error("Failed to connect to MongoDB: {}", e.getMessage());
			connected = false;
			return false;
		}
	}
	
	@Override
	public void disconnect() {
		connected = false;
		logger.info("MongoDB connection closed");
	}
	
	@Override
	public boolean isConnected() {
		return connected;
	}
	
	@Override
	public String getConnectionUrl() {
		return connectionString + "/" + databaseName;
	}
	
	@Override
	public String getDatabaseType() {
		return "MongoDB";
	}
}

