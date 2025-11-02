-- Database creation script for ex_base_15_backend
-- Run this script as MySQL root user or a user with CREATE DATABASE privileges
-- Usage: mysql -u root -p < create-database.sql

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ex_base_15_backend
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Grant privileges (optional, adjust as needed)
-- GRANT ALL PRIVILEGES ON ex_base_15_backend.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'Database ex_base_15_backend created successfully!' AS Status;

