package com.p.abstractfactory.factory.impl;

import com.p.abstractfactory.factory.DatabaseFactory;
import com.p.abstractfactory.product.Connection;
import com.p.abstractfactory.product.Repository;
import com.p.abstractfactory.product.Transaction;
import com.p.abstractfactory.product.impl.MongoDBConnection;
import com.p.abstractfactory.product.impl.MongoDBRepository;
import com.p.abstractfactory.product.impl.MongoDBTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Concrete Factory: MongoDB
 * 
 * Creates a family of MongoDB-specific products:
 * - MongoDBConnection
 * - MongoDBRepository
 * - MongoDBTransaction
 * 
 * Note: MongoDB has different transaction semantics (eventual consistency)
 * compared to SQL databases (ACID transactions).
 */
@Component
public class MongoDBFactory implements DatabaseFactory {
	
	private final String connectionString;
	private final String databaseName;
	
	public MongoDBFactory(
			@Value("${mongodb.connection.string:mongodb://localhost:27017}") String connectionString,
			@Value("${mongodb.database.name:mongodb_db}") String databaseName) {
		this.connectionString = connectionString;
		this.databaseName = databaseName;
	}
	
	@Override
	public Connection createConnection() {
		return new MongoDBConnection(connectionString, databaseName);
	}
	
	@Override
	public Repository createRepository() {
		return new MongoDBRepository(connectionString, databaseName);
	}
	
	@Override
	public Transaction createTransaction() {
		return new MongoDBTransaction(connectionString, databaseName);
	}
	
	@Override
	public String getDatabaseType() {
		return "MongoDB";
	}
}

