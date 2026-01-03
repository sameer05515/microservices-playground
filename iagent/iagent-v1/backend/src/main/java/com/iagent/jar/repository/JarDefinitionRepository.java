package com.iagent.jar.repository;
import com.iagent.jar.model.JarDefinition;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface JarDefinitionRepository extends MongoRepository<JarDefinition,String>{}
