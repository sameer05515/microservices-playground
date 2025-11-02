package com.p.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseConfig(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        this.dataSource = dataSource;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void checkDatabaseConnection() {
        try {
            String databaseName = jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);
            logger.info("Successfully connected to database: {}", databaseName);
            
            // Check if users table exists
            try {
                jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'",
                    Integer.class,
                    databaseName
                );
                logger.info("Users table exists in database: {}", databaseName);
            } catch (Exception e) {
                logger.warn("Users table does not exist yet. Hibernate should create it on startup.");
            }
        } catch (Exception e) {
            logger.error("Failed to connect to database: {}", e.getMessage(), e);
        }
    }
}

