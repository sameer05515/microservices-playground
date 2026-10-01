package com.iagent.db.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.DuplicateResourceException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.db.dto.CreateDbServiceRequest;
import com.iagent.db.dto.DbQueryResponse;
import com.iagent.db.dto.DbServiceResponse;
import com.iagent.db.model.DbConnection;
import com.iagent.db.model.DbService;
import com.iagent.db.repository.DbServiceRepository;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class DbServiceManager {

    private final DbServiceRepository repository;
    private final DbConnectionManager connectionManager;

    public DbServiceManager(
            DbServiceRepository repository,
            DbConnectionManager connectionManager) {
        this.repository = repository;
        this.connectionManager = connectionManager;
    }

    public DbServiceResponse create(CreateDbServiceRequest request) {
        String name = request.serviceName().trim();
        if (repository.existsByServiceName(name)) {
            throw new DuplicateResourceException(
                    "DbService name already exists: " + name);
        }

        connectionManager.get(request.connectionId());

        if (request.query().trim().isBlank()) {
            throw new BadRequestException("Query cannot be empty.");
        }

        Instant now = Instant.now();
        DbService service = new DbService();
        service.setServiceName(name);
        service.setConnectionId(request.connectionId());
        service.setQuery(request.query().trim());
        service.setEnabled(request.enabled() == null || request.enabled());
        service.setCreatedAt(now);
        service.setUpdatedAt(now);

        return toResponse(repository.save(service));
    }

    public List<DbServiceResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public DbQueryResponse execute(String serviceId) {
        DbService service = repository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "DbService not found: " + serviceId));

        if (!service.isEnabled()) {
            throw new BadRequestException(
                    "DbService is disabled: " + service.getServiceName());
        }

        DbConnection connectionDefinition =
                connectionManager.get(service.getConnectionId());

        long started = System.nanoTime();

        try (Connection connection = DriverManager.getConnection(
                connectionDefinition.getJdbcUrl(),
                connectionDefinition.getUsername(),
                connectionDefinition.getPassword());
             Statement statement = connection.createStatement()) {

            boolean hasResultSet = statement.execute(service.getQuery());
            long elapsed = (System.nanoTime() - started) / 1_000_000;

            if (!hasResultSet) {
                return new DbQueryResponse(
                        service.getId(), service.getServiceName(), false,
                        List.of(), List.of(), 0,
                        statement.getUpdateCount(), elapsed);
            }

            try (ResultSet resultSet = statement.getResultSet()) {
                ResultSetMetaData metadata = resultSet.getMetaData();
                int columnCount = metadata.getColumnCount();

                List<String> columns = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    columns.add(metadata.getColumnLabel(i));
                }

                List<List<Object>> rows = new ArrayList<>();
                while (resultSet.next()) {
                    List<Object> row = new ArrayList<>();
                    for (int i = 1; i <= columnCount; i++) {
                        row.add(resultSet.getObject(i));
                    }
                    rows.add(row);
                }

                return new DbQueryResponse(
                        service.getId(), service.getServiceName(), true,
                        columns, rows, rows.size(), -1, elapsed);
            }
        } catch (SQLException e) {
            throw new BadRequestException(
                    "DbService execution failed: " + e.getMessage());
        }
    }

    private DbServiceResponse toResponse(DbService s) {
        return new DbServiceResponse(
                s.getId(), s.getServiceName(), s.getConnectionId(),
                s.getQuery(), s.isEnabled(), s.getCreatedAt(), s.getUpdatedAt());
    }
}
