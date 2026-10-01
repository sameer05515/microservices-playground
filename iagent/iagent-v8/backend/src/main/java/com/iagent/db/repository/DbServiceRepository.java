package com.iagent.db.repository;

import com.iagent.db.model.DbService;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DbServiceRepository extends MongoRepository<DbService, String> {
    boolean existsByServiceName(String serviceName);
    List<DbService> findAllByOrderByCreatedAtDesc();
}
