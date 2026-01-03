package com.p.abstractfactory.config;

import com.p.abstractfactory.factory.DatabaseFactory;
import com.p.abstractfactory.factory.impl.MongoDBFactory;
import com.p.abstractfactory.factory.impl.MySQLFactory;
import com.p.abstractfactory.factory.impl.PostgreSQLFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuration class that selects which database factory to use
 * 
 * This demonstrates how the Abstract Factory Pattern allows easy switching
 * between different database implementations through configuration.
 */
@Configuration
public class DatabaseFactoryConfig {
	
	@Value("${app.database.type:mysql}")
	private String databaseType;
	
	/**
	 * Creates the appropriate database factory based on configuration
	 * 
	 * Change the 'app.database.type' property in application.properties
	 * to switch between: mysql, postgresql, mongodb
	 */
	@Bean
	@Primary
	public DatabaseFactory databaseFactory(
			MySQLFactory mySQLFactory,
			PostgreSQLFactory postgreSQLFactory,
			MongoDBFactory mongoDBFactory) {
		
		return switch (databaseType.toLowerCase()) {
			case "mysql" -> mySQLFactory;
			case "postgresql", "postgres" -> postgreSQLFactory;
			case "mongodb", "mongo" -> mongoDBFactory;
			default -> {
				System.err.println("Unknown database type: " + databaseType + ". Using MySQL as default.");
				yield mySQLFactory;
			}
		};
	}
}

