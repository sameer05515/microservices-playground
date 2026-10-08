package com.example.minigmail.config;

import com.example.minigmail.model.User;
import com.example.minigmail.repository.UserRepository;
import com.example.minigmail.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;

@Configuration
@RequiredArgsConstructor
public class SeedConfig {
    private final UserRepository userRepository;
    private final UserService userService;

    @Bean
    CommandLineRunner seedUsers() {
        return args -> {
            create("Prem Kumar", "prem@gmail.com");
            create("Rahul Kumar", "rahul@gmail.com");
            create("Demo User", "demo@gmail.com");
        };
    }

    private void create(String name, String email) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            userService.register(name, email, "123456");
            System.out.println("Created demo user: " + email + " / 123456");
        }
    }
}
