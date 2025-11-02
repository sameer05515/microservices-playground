-- Table creation script for ex_base_15_backend
-- Run this script after creating the database
-- Usage: mysql -u root -p ex_base_15_backend < create-tables.sql

USE ex_base_15_backend;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique username for login',
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt encoded password',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique email address',
    role VARCHAR(50) NOT NULL DEFAULT 'USER' COMMENT 'User role: USER or ADMIN',
    enabled BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Whether the user account is enabled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Indexes for better query performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_enabled (enabled)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='User accounts table';

-- Verify table creation
SELECT 'Table users created successfully!' AS Status;
DESCRIBE users;

