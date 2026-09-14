package com.p.ques.controller;

import com.p.ques.dto.CreateTodoRequest;
import com.p.ques.dto.UpdateTodoRequest;
import com.p.ques.entity.Todo;
import com.p.ques.service.TodoService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<Todo> createTodo(
            @Valid @RequestBody CreateTodoRequest request) {

        Todo todo = todoService.createTodo(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(todo);
    }

    @GetMapping
    public ResponseEntity<List<Todo>> getTodos() {

        return ResponseEntity.ok(
                todoService.getTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodo(
            @PathVariable String id) {

        return ResponseEntity.ok(
                todoService.getTodo(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(
            @PathVariable String id,
            @Valid @RequestBody UpdateTodoRequest request) {

        return ResponseEntity.ok(
                todoService.updateTodo(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable String id) {

        todoService.deleteTodo(id);

        return ResponseEntity.noContent().build();
    }
}