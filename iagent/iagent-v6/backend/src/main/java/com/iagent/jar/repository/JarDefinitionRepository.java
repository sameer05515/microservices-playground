package com.iagent.jar.repository;

import com.iagent.jar.model.JarDefinition;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JarDefinitionRepository extends MongoRepository<JarDefinition, String> {
    boolean existsByFileName(String fileName);
    List<JarDefinition> findAllByOrderByUploadedAtDesc();
}
