package com.p.abstractfactory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

/**
 * Main Spring Boot Application
 * 
 * Excludes default DataSource and JPA auto-configuration to allow
 * manual configuration of multiple database systems using Abstract Factory Pattern
 */
@SpringBootApplication(exclude = {
	DataSourceAutoConfiguration.class,
	HibernateJpaAutoConfiguration.class
})
public class AbstractFactoryDatabaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(AbstractFactoryDatabaseApplication.class, args);
	}

}

