package com.iagent.db.service;

import com.iagent.common.BadRequestException;
import com.iagent.common.DuplicateResourceException;
import com.iagent.common.ResourceNotFoundException;
import com.iagent.db.dto.CreateDbServiceRequest;
import com.iagent.db.dto.DbQueryResponse;
import com.iagent.db.dto.DbServiceResponse;
import com.iagent.db.dto.TestDbServiceRequest;
import com.iagent.db.model.DbConnection;
import com.iagent.db.model.DbService;
import com.iagent.db.repository.DbServiceRepository;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DbServiceManager {

    private static final Pattern PARAMETER_PATTERN =
            Pattern.compile("#([A-Za-z_][A-Za-z0-9_]*)#");

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
        String query = request.query().trim();

        if (repository.existsByServiceName(name)) {
            throw new DuplicateResourceException(
                    "DbService name already exists: " + name);
        }

        DbConnection connection = connectionManager.get(request.connectionId());
        List<String> parameterNames = extractParameterNames(query);

        // A service is only persisted after its exact query has been tested.
        executeAgainstConnection(connection, query, request.parameters(), parameterNames);

        Instant now = Instant.now();
        DbService service = new DbService();
        service.setServiceName(name);
        service.setConnectionId(connection.getId());
        service.setQuery(query);
        service.setParameterNames(parameterNames);
        service.setEnabled(request.enabled() == null || request.enabled());
        service.setCreatedAt(now);
        service.setUpdatedAt(now);

        return toResponse(repository.save(service));
    }

    public List<DbServiceResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public DbServiceResponse details(String serviceId) {
        DbService service = repository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "DbService not found: " + serviceId));
        return toResponse(service);
    }

    public DbQueryResponse test(TestDbServiceRequest request) {
        DbConnection connection = connectionManager.get(request.connectionId());
        String query = request.query().trim();
        List<String> parameterNames = extractParameterNames(query);
        return executeAgainstConnection(
                connection, query, request.parameters(), parameterNames,
                null, "Test Service");
    }

    public DbQueryResponse execute(String serviceId, Map<String, Object> parameters) {
        DbService service = repository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "DbService not found: " + serviceId));

        if (!service.isEnabled()) {
            throw new BadRequestException(
                    "DbService is disabled: " + service.getServiceName());
        }

        DbConnection connection = connectionManager.get(service.getConnectionId());
        return executeAgainstConnection(
                connection,
                service.getQuery(),
                parameters,
                service.getParameterNames(),
                service.getId(),
                service.getServiceName());
    }

    private DbQueryResponse executeAgainstConnection(
            DbConnection connection,
            String query,
            Map<String, Object> parameters,
            List<String> parameterNames) {
        return executeAgainstConnection(
                connection, query, parameters, parameterNames, null, "Test Service");
    }

    private DbQueryResponse executeAgainstConnection(
            DbConnection connection,
            String query,
            Map<String, Object> parameters,
            List<String> parameterNames,
            String serviceId,
            String serviceName) {

        validateParameters(parameterNames, parameters);
        String sql = parameterizedSql(query);
        long started = System.nanoTime();

        try (Connection dbConnection = DriverManager.getConnection(
                connection.getJdbcUrl(),
                connection.getUsername(),
                connection.getPassword());
             PreparedStatement statement = dbConnection.prepareStatement(sql)) {

            bindParameters(statement, query, parameterNames, parameters);
            boolean hasResultSet = statement.execute();
            long elapsed = (System.nanoTime() - started) / 1_000_000;

            if (!hasResultSet) {
                return new DbQueryResponse(
                        serviceId, serviceName, false,
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
                        serviceId, serviceName, true,
                        columns, rows, rows.size(), -1, elapsed);
            }
        } catch (SQLException e) {
            throw new BadRequestException(
                    "DbService execution failed: " + e.getMessage());
        }
    }

    private List<String> extractParameterNames(String query) {
        if (query == null || query.isBlank()) {
            throw new BadRequestException("Query cannot be empty.");
        }

        Matcher matcher = PARAMETER_PATTERN.matcher(query);
        Set<String> names = new LinkedHashSet<>();
        while (matcher.find()) {
            names.add(matcher.group(1));
        }
        return new ArrayList<>(names);
    }

    private String parameterizedSql(String query) {
        return PARAMETER_PATTERN.matcher(query).replaceAll("?");
    }

    private void validateParameters(
            List<String> parameterNames,
            Map<String, Object> parameters) {

        Map<String, Object> values = parameters == null ? Map.of() : parameters;

        for (String name : parameterNames) {
            if (!values.containsKey(name)) {
                throw new BadRequestException(
                        "Missing query parameter: " + name);
            }
        }
    }

    private void bindParameters(
            PreparedStatement statement,
            String originalQuery,
            List<String> parameterNames,
            Map<String, Object> parameters) throws SQLException {

        Map<String, Object> values = parameters == null ? Map.of() : parameters;
        Matcher matcher = PARAMETER_PATTERN.matcher(originalQuery);
        int index = 1;

        while (matcher.find()) {
            String name = matcher.group(1);
            Object value = values.get(name);
            statement.setObject(index++, value);
        }
    }

    private DbServiceResponse toResponse(DbService s) {
        String connectionName = connectionManager.get(s.getConnectionId()).getName();
        return new DbServiceResponse(
                s.getId(),
                s.getServiceName(),
                s.getConnectionId(),
                connectionName,
                s.getQuery(),
                s.getParameterNames() == null ? List.of() : s.getParameterNames(),
                s.isEnabled(),
                s.getCreatedAt(),
                s.getUpdatedAt());
    }
}
