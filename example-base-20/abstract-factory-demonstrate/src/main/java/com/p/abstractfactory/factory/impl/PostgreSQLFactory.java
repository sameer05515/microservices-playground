package com.p.abstractfactory.factory.impl;

import com.p.abstractfactory.factory.DatabaseFactory;
import com.p.abstractfactory.product.Connection;
import com.p.abstractfactory.product.Repository;
import com.p.abstractfactory.product.Transaction;
import com.p.abstractfactory.product.impl.PostgreSQLConnection;
import com.p.abstractfactory.product.impl.PostgreSQLRepository;
import com.p.abstractfactory.product.impl.PostgreSQLTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Concrete Factory: PostgreSQL
 * 
 * Creates a family of PostgreSQL-specific products:
 * - PostgreSQLConnection
 * - PostgreSQLRepository
 * - PostgreSQLTransaction
 */
@Component
public class PostgreSQLFactory implements DatabaseFactory {
	
	private final String jdbcUrl;
	private final String username;
	private final String password;
	
	public PostgreSQLFactory(
			@Value("${postgresql.datasource.url:jdbc:postgresql://localhost:5432/postgres_db}") String jdbcUrl,
			@Value("${postgresql.datasource.username:postgres}") String username,
			@Value("${postgresql.datasource.password:password}") String password) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
	}
	
	@Override
	public Connection createConnection() {
		return new PostgreSQLConnection(jdbcUrl, username, password);
	}
	
	@Override
	public Repository createRepository() {
		return new PostgreSQLRepository(jdbcUrl, username, password);
	}
	
	@Override
	public Transaction createTransaction() {
		return new PostgreSQLTransaction(jdbcUrl, username, password);
	}
	
	@Override
	public String getDatabaseType() {
		return "PostgreSQL";
	}
}

