package com.p.ques.repository;

import com.p.ques.entity.Todo;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository
        extends MongoRepository<Todo, String> {

    List<Todo> findByUserEmailOrderByCreatedAtDesc(
            String userEmail
    );

    Optional<Todo> findByIdAndUserEmail(
            String id,
            String userEmail
    );
}