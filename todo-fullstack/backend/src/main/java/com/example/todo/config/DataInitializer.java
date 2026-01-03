package com.example.todo.config;

import com.example.todo.entity.Todo;
import com.example.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Bean
    CommandLineRunner seed(TodoRepository repository) {
        return args -> {
            repository.save(Todo.builder()
                    .title("Learn TanStack Query")
                    .description("Understand useQuery and useMutation")
                    .completed(false)
                    .build());

            repository.save(Todo.builder()
                    .title("Build Spring Boot API")
                    .description("Create CRUD Todo APIs")
                    .completed(true)
                    .build());
        };
    }
}
