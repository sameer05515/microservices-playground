package com.p.todo.controller;

import com.p.todo.model.Todo;
import com.p.todo.service.TodoService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Todo> getAll() throws IOException {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Todo getById(@PathVariable int id) throws IOException {
        return service.getById(id);
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) throws IOException {
        return service.add(todo);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable int id, @RequestBody Todo todo) throws IOException {
        return service.update(id, todo);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable int id) throws IOException {
        return service.delete(id);
    }
}
