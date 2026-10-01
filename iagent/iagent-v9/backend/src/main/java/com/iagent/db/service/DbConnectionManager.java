package com.iagent.db.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.DuplicateResourceException;
import com.iagent.db.dto.ConnectionTestResponse;
import com.iagent.db.dto.DbConnectionRequest;
import com.iagent.db.dto.DbConnectionResponse;
import com.iagent.db.model.DbConnection;
import com.iagent.db.repository.DbConnectionRepository;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;

@Service
public class DbConnectionManager {

    private final DbConnectionRepository repository;

    public DbConnectionManager(DbConnectionRepository repository) {
        this.repository = repository;
    }

    public ConnectionTestResponse test(DbConnectionRequest request) {
        validateUrl(request.jdbcUrl());
        try (Connection connection = DriverManager.getConnection(
                request.jdbcUrl(), request.username(), request.password())) {
            return new ConnectionTestResponse(
                    connection.isValid(5),
                    "Database connection successful.");
        } catch (SQLException e) {
            throw new BadRequestException(
                    "Database connection failed: " + e.getMessage());
        }
    }

    public DbConnectionResponse create(DbConnectionRequest request) {
        test(request);

        if (repository.existsByName(request.name().trim())) {
            throw new DuplicateResourceException(
                    "DB connection name already exists: " + request.name());
        }

        Instant now = Instant.now();
        DbConnection connection = new DbConnection();
        connection.setName(request.name().trim());
        connection.setJdbcUrl(request.jdbcUrl().trim());
        connection.setUsername(request.username().trim());
        connection.setPassword(request.password());
        connection.setCreatedAt(now);
        connection.setUpdatedAt(now);

        return toResponse(repository.save(connection));
    }

    public List<DbConnectionResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public DbConnection get(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new com.iagent.common.ResourceNotFoundException(
                        "DB connection not found: " + id));
    }

    private DbConnectionResponse toResponse(DbConnection c) {
        return new DbConnectionResponse(
                c.getId(), c.getName(), c.getJdbcUrl(), c.getUsername(),
                c.getCreatedAt(), c.getUpdatedAt());
    }

    private void validateUrl(String url) {
        if (url == null || !url.trim().startsWith("jdbc:")) {
            throw new BadRequestException(
                    "JDBC URL must start with jdbc:, for example jdbc:mysql://localhost:3306/mydb");
        }
    }
}
