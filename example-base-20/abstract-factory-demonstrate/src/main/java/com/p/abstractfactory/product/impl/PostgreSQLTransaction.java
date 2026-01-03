package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.product.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Concrete Product: PostgreSQL Transaction
 */
public class PostgreSQLTransaction implements Transaction {
	
	private static final Logger logger = LoggerFactory.getLogger(PostgreSQLTransaction.class);
	private final String jdbcUrl;
	private final String username;
	private final String password;
	private Connection connection;
	private boolean active = false;
	
	public PostgreSQLTransaction(String jdbcUrl, String username, String password) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
	}
	
	@Override
	public void begin() {
		try {
			connection = DriverManager.getConnection(jdbcUrl, username, password);
			connection.setAutoCommit(false);
			active = true;
			logger.info("PostgreSQL transaction begun");
		} catch (SQLException e) {
			logger.error("Error beginning PostgreSQL transaction: {}", e.getMessage());
			throw new RuntimeException("Failed to begin transaction", e);
		}
	}
	
	@Override
	public void commit() {
		if (connection != null && active) {
			try {
				connection.commit();
				active = false;
				logger.info("PostgreSQL transaction committed");
			} catch (SQLException e) {
				logger.error("Error committing PostgreSQL transaction: {}", e.getMessage());
				throw new RuntimeException("Failed to commit transaction", e);
			} finally {
				closeConnection();
			}
		}
	}
	
	@Override
	public void rollback() {
		if (connection != null && active) {
			try {
				connection.rollback();
				active = false;
				logger.info("PostgreSQL transaction rolled back");
			} catch (SQLException e) {
				logger.error("Error rolling back PostgreSQL transaction: {}", e.getMessage());
			} finally {
				closeConnection();
			}
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
		return "PostgreSQL";
	}
	
	private void closeConnection() {
		if (connection != null) {
			try {
				connection.close();
			} catch (SQLException e) {
				logger.error("Error closing PostgreSQL transaction connection: {}", e.getMessage());
			}
		}
	}
	
	public Connection getConnection() {
		return connection;
	}
}

