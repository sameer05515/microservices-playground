package com.iagent.javaservice.history;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JavaServiceExecutionLogRepository
        extends MongoRepository<JavaServiceExecutionLog, String> {

    List<JavaServiceExecutionLog> findTop100ByOrderByExecutedAtDesc();

    List<JavaServiceExecutionLog> findTop100ByServiceIdOrderByExecutedAtDesc(
            String serviceId);
}
