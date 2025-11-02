-- Script to create an admin user
-- Run this script after the users table is created
-- Usage: mysql -u root -p ex_base_15_backend < create-admin-user.sql
-- 
-- Default credentials:
-- Username: admin
-- Password: admin123
-- 
-- IMPORTANT: Change the password immediately after first login!

USE ex_base_15_backend;

-- Insert admin user
-- Password 'admin123' is BCrypt encoded: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (username, password, email, role, enabled) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@example.com', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE 
    role = 'ADMIN',
    enabled = TRUE;

SELECT 'Admin user created/updated successfully!' AS Status;
SELECT id, username, email, role, enabled FROM users WHERE username = 'admin';

