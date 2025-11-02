-- Script to drop the database (use with caution!)
-- Run this script to completely remove the database and all its data
-- Usage: mysql -u root -p < drop-database.sql
-- 
-- WARNING: This will delete all data in the database!

DROP DATABASE IF EXISTS ex_base_15_backend;

SELECT 'Database ex_base_15_backend dropped successfully!' AS Status;

