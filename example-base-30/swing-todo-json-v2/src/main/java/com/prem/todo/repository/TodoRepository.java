package com.prem.todo.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.prem.todo.model.Todo;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class TodoRepository {
    private final ObjectMapper mapper = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);
    private final File file = new File("todos.json");

    public synchronized List<Todo> findAll() {
        if (!file.exists()) return new ArrayList<>();
        try {
            return mapper.readValue(file, new TypeReference<List<Todo>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Unable to read todos.json", e);
        }
    }

    public synchronized void saveAll(List<Todo> todos) {
        try {
            mapper.writeValue(file, todos);
        } catch (IOException e) {
            throw new RuntimeException("Unable to save todos.json", e);
        }
    }
}
