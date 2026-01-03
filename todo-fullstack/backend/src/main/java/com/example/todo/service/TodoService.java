package com.example.todo.service;

import com.example.todo.dto.*;
import com.example.todo.entity.Todo;
import com.example.todo.exception.TodoNotFoundException;
import com.example.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository repository;

    public List<TodoResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public TodoResponse findById(Long id) {
        return toResponse(getTodo(id));
    }

    public TodoResponse create(TodoRequest request) {
        Todo todo = Todo.builder()
                .title(request.title())
                .description(request.description())
                .completed(false)
                .build();

        return toResponse(repository.save(todo));
    }

    public TodoResponse update(Long id, TodoRequest request) {
        Todo todo = getTodo(id);
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        return toResponse(repository.save(todo));
    }

    public TodoResponse toggleComplete(Long id) {
        Todo todo = getTodo(id);
        todo.setCompleted(!todo.isCompleted());
        return toResponse(repository.save(todo));
    }

    public void delete(Long id) {
        Todo todo = getTodo(id);
        repository.delete(todo);
    }

    private Todo getTodo(Long id) {
        return repository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));
    }

    private TodoResponse toResponse(Todo todo) {
        return new TodoResponse(todo.getId(), todo.getTitle(),
                todo.getDescription(), todo.isCompleted());
    }
}
