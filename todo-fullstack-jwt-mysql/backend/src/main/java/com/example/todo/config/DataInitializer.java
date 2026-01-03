package com.example.todo.config;

import com.example.todo.auth.Role;
import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {

        if (!users.existsByUsername("demo")) {

            users.save(
                    User.builder()
                            .username("demo")
                            .password(encoder.encode("password"))
                            .role(Role.USER)
                            .build()
            );
        }

        if (!users.existsByUsername("admin")) {

            users.save(
                    User.builder()
                            .username("admin")
                            .password(encoder.encode("admin123"))
                            .role(Role.ADMIN)
                            .build()
            );
        }
    }
}