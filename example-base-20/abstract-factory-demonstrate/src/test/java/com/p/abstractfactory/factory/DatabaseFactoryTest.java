package com.p.abstractfactory.factory;

import com.p.abstractfactory.factory.impl.MongoDBFactory;
import com.p.abstractfactory.factory.impl.MySQLFactory;
import com.p.abstractfactory.factory.impl.PostgreSQLFactory;
import com.p.abstractfactory.product.Connection;
import com.p.abstractfactory.product.Repository;
import com.p.abstractfactory.product.Transaction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Database Factory Tests")
class DatabaseFactoryTest {
	
	@Test
	@DisplayName("MySQL Factory creates MySQL products")
	void testMySQLFactory() {
		DatabaseFactory factory = new MySQLFactory(
			"jdbc:mysql://localhost:3306/test",
			"root",
			"password"
		);
		
		assertEquals("MySQL", factory.getDatabaseType());
		
		Connection connection = factory.createConnection();
		Repository repository = factory.createRepository();
		Transaction transaction = factory.createTransaction();
		
		assertEquals("MySQL", connection.getDatabaseType());
		assertEquals("MySQL", repository.getDatabaseType());
		assertEquals("MySQL", transaction.getDatabaseType());
	}
	
	@Test
	@DisplayName("PostgreSQL Factory creates PostgreSQL products")
	void testPostgreSQLFactory() {
		DatabaseFactory factory = new PostgreSQLFactory(
			"jdbc:postgresql://localhost:5432/test",
			"postgres",
			"password"
		);
		
		assertEquals("PostgreSQL", factory.getDatabaseType());
		
		Connection connection = factory.createConnection();
		Repository repository = factory.createRepository();
		Transaction transaction = factory.createTransaction();
		
		assertEquals("PostgreSQL", connection.getDatabaseType());
		assertEquals("PostgreSQL", repository.getDatabaseType());
		assertEquals("PostgreSQL", transaction.getDatabaseType());
	}
	
	@Test
	@DisplayName("MongoDB Factory creates MongoDB products")
	void testMongoDBFactory() {
		DatabaseFactory factory = new MongoDBFactory(
			"mongodb://localhost:27017",
			"test"
		);
		
		assertEquals("MongoDB", factory.getDatabaseType());
		
		Connection connection = factory.createConnection();
		Repository repository = factory.createRepository();
		Transaction transaction = factory.createTransaction();
		
		assertEquals("MongoDB", connection.getDatabaseType());
		assertEquals("MongoDB", repository.getDatabaseType());
		assertEquals("MongoDB", transaction.getDatabaseType());
	}
	
	@Test
	@DisplayName("Products from same factory are compatible")
	void testProductCompatibility() {
		DatabaseFactory factory = new MySQLFactory(
			"jdbc:mysql://localhost:3306/test",
			"root",
			"password"
		);
		
		Connection connection = factory.createConnection();
		Repository repository = factory.createRepository();
		Transaction transaction = factory.createTransaction();
		
		// All products should be from the same database type
		assertEquals(connection.getDatabaseType(), repository.getDatabaseType());
		assertEquals(repository.getDatabaseType(), transaction.getDatabaseType());
	}
}

