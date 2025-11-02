package com.p.backend.controller;

import com.p.backend.dto.AuthResponse;
import com.p.backend.dto.LoginRequest;
import com.p.backend.dto.RegisterRequest;
import com.p.backend.entity.User;
import com.p.backend.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("Registration attempt for username: {}", registerRequest.getUsername());
        try {
            User user = userService.register(registerRequest);
            
            AuthResponse response = AuthResponse.builder()
                    .message("User registered successfully")
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .success(true)
                    .build();
            
            logger.info("User registered successfully: {}", user.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            logger.warn("Registration failed: {}", e.getMessage());
            AuthResponse response = AuthResponse.builder()
                    .message(e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for username: {}", loginRequest.getUsername());
        
        return userService.findByUsername(loginRequest.getUsername())
                .filter(user -> passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
                .filter(user -> user.isEnabled())
                .map(user -> {
                    logger.info("Login successful for user: {}", user.getUsername());
                    AuthResponse response = AuthResponse.builder()
                            .message("Login successful")
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .success(true)
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    logger.warn("Login failed for username: {}", loginRequest.getUsername());
                    AuthResponse response = AuthResponse.builder()
                            .message("Invalid username or password")
                            .success(false)
                            .build();
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                });
    }
}

