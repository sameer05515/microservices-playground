package com.p.abstractfactory.product;

/**
 * Abstract Product: Connection
 * 
 * Represents a database connection. Each concrete database implementation
 * (MySQL, PostgreSQL, MongoDB) will have its own Connection implementation
 * that knows how to connect to that specific database type.
 */
public interface Connection {
	
	/**
	 * Establishes a connection to the database
	 * @return true if connection successful, false otherwise
	 */
	boolean connect();
	
	/**
	 * Closes the database connection
	 */
	void disconnect();
	
	/**
	 * Checks if the connection is active
	 * @return true if connected, false otherwise
	 */
	boolean isConnected();
	
	/**
	 * Gets the connection URL
	 * @return connection URL string
	 */
	String getConnectionUrl();
	
	/**
	 * Gets the database type
	 * @return database type name
	 */
	String getDatabaseType();
}

