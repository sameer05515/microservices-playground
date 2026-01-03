package com.p.abstractfactory.factory.impl;

import com.p.abstractfactory.factory.DatabaseFactory;
import com.p.abstractfactory.product.Connection;
import com.p.abstractfactory.product.Repository;
import com.p.abstractfactory.product.Transaction;
import com.p.abstractfactory.product.impl.MySQLConnection;
import com.p.abstractfactory.product.impl.MySQLRepository;
import com.p.abstractfactory.product.impl.MySQLTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Concrete Factory: MySQL
 * 
 * Creates a family of MySQL-specific products:
 * - MySQLConnection
 * - MySQLRepository
 * - MySQLTransaction
 * 
 * All products created by this factory are compatible with each other
 * and work together seamlessly.
 */
@Component
public class MySQLFactory implements DatabaseFactory {
	
	private final String jdbcUrl;
	private final String username;
	private final String password;
	
	public MySQLFactory(
			@Value("${mysql.datasource.url:jdbc:mysql://localhost:3306/mysql_db}") String jdbcUrl,
			@Value("${mysql.datasource.username:root}") String username,
			@Value("${mysql.datasource.password:password}") String password) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
	}
	
	@Override
	public Connection createConnection() {
		return new MySQLConnection(jdbcUrl, username, password);
	}
	
	@Override
	public Repository createRepository() {
		return new MySQLRepository(jdbcUrl, username, password);
	}
	
	@Override
	public Transaction createTransaction() {
		return new MySQLTransaction(jdbcUrl, username, password);
	}
	
	@Override
	public String getDatabaseType() {
		return "MySQL";
	}
}

