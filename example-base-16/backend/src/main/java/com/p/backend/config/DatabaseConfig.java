package com.p.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;


@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public DatabaseConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void checkDatabaseConnection() {
        try {
            String databaseName = mongoTemplate.getDb().getName();
            logger.info("Successfully connected to MongoDB database: {}", databaseName);
            
            // Check if users collection exists
            boolean collectionExists = mongoTemplate.collectionExists("users");
            if (collectionExists) {
                long userCount = mongoTemplate.getCollection("users").countDocuments();
                logger.info("Users collection exists in database: {} with {} documents", databaseName, userCount);
            } else {
                logger.info("Users collection will be created automatically on first insert.");
            }
        } catch (Exception e) {
            logger.error("Failed to connect to MongoDB database: {}", e.getMessage(), e);
        }
    }
}

