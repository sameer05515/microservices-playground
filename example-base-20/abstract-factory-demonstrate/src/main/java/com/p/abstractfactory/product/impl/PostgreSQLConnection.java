package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.product.Connection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Concrete Product: PostgreSQL Connection
 */
public class PostgreSQLConnection implements Connection {
	
	private static final Logger logger = LoggerFactory.getLogger(PostgreSQLConnection.class);
	private final String jdbcUrl;
	private final String username;
	private final String password;
	private java.sql.Connection sqlConnection;
	private boolean connected = false;
	
	public PostgreSQLConnection(String jdbcUrl, String username, String password) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
	}
	
	@Override
	public boolean connect() {
		try {
			sqlConnection = DriverManager.getConnection(jdbcUrl, username, password);
			connected = sqlConnection != null && !sqlConnection.isClosed();
			if (connected) {
				logger.info("PostgreSQL connection established: {}", jdbcUrl);
			}
			return connected;
		} catch (SQLException e) {
			logger.error("Failed to connect to PostgreSQL: {}", e.getMessage());
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
				logger.info("PostgreSQL connection closed");
			} catch (SQLException e) {
				logger.error("Error closing PostgreSQL connection: {}", e.getMessage());
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
		return "PostgreSQL";
	}
	
	public java.sql.Connection getSqlConnection() {
		return sqlConnection;
	}
}

