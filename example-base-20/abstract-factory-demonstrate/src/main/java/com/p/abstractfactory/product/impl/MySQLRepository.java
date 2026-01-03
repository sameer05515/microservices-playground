package com.p.abstractfactory.product.impl;

import com.p.abstractfactory.model.User;
import com.p.abstractfactory.product.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concrete Product: MySQL Repository
 * 
 * Implements data access operations using JDBC for MySQL
 */
public class MySQLRepository implements Repository<User, Long> {
	
	private static final Logger logger = LoggerFactory.getLogger(MySQLRepository.class);
	private final String jdbcUrl;
	private final String username;
	private final String password;
	
	public MySQLRepository(String jdbcUrl, String username, String password) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
		initializeTable();
	}
	
	private void initializeTable() {
		try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
			 Statement stmt = conn.createStatement()) {
			
			String createTable = """
				CREATE TABLE IF NOT EXISTS users (
					id BIGINT AUTO_INCREMENT PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					email VARCHAR(255) UNIQUE NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				)
				""";
			stmt.execute(createTable);
			logger.info("MySQL users table initialized");
		} catch (SQLException e) {
			logger.error("Error initializing MySQL table: {}", e.getMessage());
		}
	}
	
	@Override
	public User save(User entity) {
		String sql = entity.getId() == null
			? "INSERT INTO users (name, email) VALUES (?, ?)"
			: "UPDATE users SET name = ?, email = ? WHERE id = ?";
		
		try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
			 PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
			
			pstmt.setString(1, entity.getName());
			pstmt.setString(2, entity.getEmail());
			
			if (entity.getId() != null) {
				pstmt.setLong(3, entity.getId());
			}
			
			pstmt.executeUpdate();
			
			if (entity.getId() == null) {
				try (ResultSet rs = pstmt.getGeneratedKeys()) {
					if (rs.next()) {
						entity.setId(rs.getLong(1));
					}
				}
			}
			
			logger.info("User saved in MySQL: {}", entity);
			return entity;
		} catch (SQLException e) {
			logger.error("Error saving user in MySQL: {}", e.getMessage());
			throw new RuntimeException("Failed to save user", e);
		}
	}
	
	@Override
	public Optional<User> findById(Long id) {
		String sql = "SELECT * FROM users WHERE id = ?";
		
		try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
			 PreparedStatement pstmt = conn.prepareStatement(sql)) {
			
			pstmt.setLong(1, id);
			
			try (ResultSet rs = pstmt.executeQuery()) {
				if (rs.next()) {
					User user = new User();
					user.setId(rs.getLong("id"));
					user.setName(rs.getString("name"));
					user.setEmail(rs.getString("email"));
					return Optional.of(user);
				}
			}
		} catch (SQLException e) {
			logger.error("Error finding user in MySQL: {}", e.getMessage());
		}
		
		return Optional.empty();
	}
	
	@Override
	public List<User> findAll() {
		List<User> users = new ArrayList<>();
		String sql = "SELECT * FROM users";
		
		try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
			 Statement stmt = conn.createStatement();
			 ResultSet rs = stmt.executeQuery(sql)) {
			
			while (rs.next()) {
				User user = new User();
				user.setId(rs.getLong("id"));
				user.setName(rs.getString("name"));
				user.setEmail(rs.getString("email"));
				users.add(user);
			}
		} catch (SQLException e) {
			logger.error("Error finding all users in MySQL: {}", e.getMessage());
		}
		
		return users;
	}
	
	@Override
	public void deleteById(Long id) {
		String sql = "DELETE FROM users WHERE id = ?";
		
		try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
			 PreparedStatement pstmt = conn.prepareStatement(sql)) {
			
			pstmt.setLong(1, id);
			pstmt.executeUpdate();
			logger.info("User deleted from MySQL: id={}", id);
		} catch (SQLException e) {
			logger.error("Error deleting user from MySQL: {}", e.getMessage());
			throw new RuntimeException("Failed to delete user", e);
		}
	}
	
	@Override
	public boolean existsById(Long id) {
		return findById(id).isPresent();
	}
	
	@Override
	public long count() {
		String sql = "SELECT COUNT(*) FROM users";
		
		try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
			 Statement stmt = conn.createStatement();
			 ResultSet rs = stmt.executeQuery(sql)) {
			
			if (rs.next()) {
				return rs.getLong(1);
			}
		} catch (SQLException e) {
			logger.error("Error counting users in MySQL: {}", e.getMessage());
		}
		
		return 0;
	}
	
	@Override
	public String getDatabaseType() {
		return "MySQL";
	}
}

