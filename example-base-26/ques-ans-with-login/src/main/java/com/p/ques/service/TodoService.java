package com.p.ques.service;

import com.p.ques.dto.CreateTodoRequest;
import com.p.ques.dto.UpdateTodoRequest;
import com.p.ques.entity.Todo;
import com.p.ques.repository.TodoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public Todo createTodo(CreateTodoRequest request) {

        String userEmail = getCurrentUserEmail();

        Instant now = Instant.now();

        Todo todo = Todo.builder()
                .title(request.title().trim())
                .completed(false)
                .userEmail(userEmail)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return todoRepository.save(todo);
    }

    public List<Todo> getTodos() {

        String userEmail = getCurrentUserEmail();

        return todoRepository
                .findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public Todo getTodo(String id) {

        String userEmail = getCurrentUserEmail();

        return findTodo(id, userEmail);
    }

    public Todo updateTodo(
            String id,
            UpdateTodoRequest request) {

        String userEmail = getCurrentUserEmail();

        Todo todo = findTodo(id, userEmail);

        todo.setTitle(request.title().trim());

        todo.setCompleted(request.completed());

        todo.setUpdatedAt(Instant.now());

        return todoRepository.save(todo);
    }

    public void deleteTodo(String id) {

        String userEmail = getCurrentUserEmail();

        Todo todo = findTodo(id, userEmail);

        todoRepository.delete(todo);
    }

    private Todo findTodo(
            String id,
            String userEmail) {

        return todoRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new TodoNotFoundException(
                                "Todo not found"
                        )
                );
    }

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalStateException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }
}