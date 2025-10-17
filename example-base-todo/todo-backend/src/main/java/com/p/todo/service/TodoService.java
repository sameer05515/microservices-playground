package com.p.todo.service;

import com.p.todo.model.Todo;
import com.p.todo.util.JsonUtil;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class TodoService {
    public List<Todo> getAll() throws IOException {
        return JsonUtil.readTodos();
    }

    public Todo getById(int id) throws IOException {
        return JsonUtil.readTodos().stream()
                .filter(t -> t.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public Todo add(Todo todo) throws IOException {
        List<Todo> todos = JsonUtil.readTodos();
        int newId = todos.stream().mapToInt(Todo::getId).max().orElse(0) + 1;
        todo.setId(newId);
        todos.add(todo);
        JsonUtil.writeTodos(todos);
        return todo;
    }

    public Todo update(int id, Todo updated) throws IOException {
        List<Todo> todos = JsonUtil.readTodos();
        for (int i = 0; i < todos.size(); i++) {
            if (todos.get(i).getId() == id) {
                updated.setId(id);
                todos.set(i, updated);
                JsonUtil.writeTodos(todos);
                return updated;
            }
        }
        return null;
    }

    public boolean delete(int id) throws IOException {
        List<Todo> todos = JsonUtil.readTodos();
        boolean removed = todos.removeIf(t -> t.getId() == id);
        if (removed) JsonUtil.writeTodos(todos);
        return removed;
    }
}
