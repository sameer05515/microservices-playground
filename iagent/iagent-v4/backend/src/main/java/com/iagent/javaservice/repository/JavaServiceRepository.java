package com.iagent.javaservice.repository;

import com.iagent.javaservice.model.JavaService;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JavaServiceRepository extends MongoRepository<JavaService, String> {
    List<JavaService> findAllByOrderByCreatedAtDesc();
}
