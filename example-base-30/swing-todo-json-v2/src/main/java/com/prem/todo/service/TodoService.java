package com.prem.todo.service;

import com.prem.todo.model.Todo;
import com.prem.todo.repository.TodoRepository;

import java.util.Comparator;
import java.util.List;

public class TodoService {
    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparingLong(Todo::getId))
                .toList();
    }

    public Todo add(String title, String description, String priority, String dueDate) {
        List<Todo> todos = repository.findAll();
        long id = todos.stream().mapToLong(Todo::getId).max().orElse(0) + 1;
        Todo todo = new Todo(id, title, description, false, priority, dueDate);
        todos.add(todo);
        repository.saveAll(todos);
        return todo;
    }

    public void update(long id, String title, String description,
                       String priority, String dueDate, boolean completed) {
        List<Todo> todos = repository.findAll();
        todos.stream().filter(t -> t.getId() == id).findFirst().ifPresent(t -> {
            t.setTitle(title);
            t.setDescription(description);
            t.setPriority(priority);
            t.setDueDate(dueDate);
            t.setCompleted(completed);
        });
        repository.saveAll(todos);
    }

    public void delete(long id) {
        List<Todo> todos = repository.findAll();
        todos.removeIf(t -> t.getId() == id);
        repository.saveAll(todos);
    }

    public void toggle(long id) {
        List<Todo> todos = repository.findAll();
        todos.stream().filter(t -> t.getId() == id).findFirst()
                .ifPresent(t -> t.setCompleted(!t.isCompleted()));
        repository.saveAll(todos);
    }
}
