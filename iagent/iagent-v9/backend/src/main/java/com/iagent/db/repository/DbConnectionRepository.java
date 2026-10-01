package com.iagent.db.repository;

import com.iagent.db.model.DbConnection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DbConnectionRepository extends MongoRepository<DbConnection, String> {
    boolean existsByName(String name);
    List<DbConnection> findAllByOrderByCreatedAtDesc();
}
