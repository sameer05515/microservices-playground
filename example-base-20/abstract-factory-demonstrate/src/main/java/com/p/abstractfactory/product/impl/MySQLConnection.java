package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.product.Connection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Concrete Product: MySQL Connection
 */
public class MySQLConnection implements Connection {
	
	private static final Logger logger = LoggerFactory.getLogger(MySQLConnection.class);
	private final String jdbcUrl;
	private final String username;
	private final String password;
	private java.sql.Connection sqlConnection;
	private boolean connected = false;
	
	public MySQLConnection(String jdbcUrl, String username, String password) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
	}
	
	@Override
	public boolean connect() {
		try {
			// In a real application, you'd use a connection pool
			// This is simplified for demonstration
			sqlConnection = DriverManager.getConnection(jdbcUrl, username, password);
			connected = sqlConnection != null && !sqlConnection.isClosed();
			if (connected) {
				logger.info("MySQL connection established: {}", jdbcUrl);
			}
			return connected;
		} catch (SQLException e) {
			logger.error("Failed to connect to MySQL: {}", e.getMessage());
			connected = false;
			return false;
		}
	}
	
	@Override
	public void disconnect() {
		if (sqlConnection != null) {
			try {
				sqlConnection.close();
				connected = false;
				logger.info("MySQL connection closed");
			} catch (SQLException e) {
				logger.error("Error closing MySQL connection: {}", e.getMessage());
			}
		}
	}
	
	@Override
	public boolean isConnected() {
		try {
			return connected && sqlConnection != null && !sqlConnection.isClosed();
		} catch (SQLException e) {
			return false;
		}
	}
	
	@Override
	public String getConnectionUrl() {
		return jdbcUrl;
	}
	
	@Override
	public String getDatabaseType() {
		return "MySQL";
	}
	
	public java.sql.Connection getSqlConnection() {
		return sqlConnection;
	}
}

