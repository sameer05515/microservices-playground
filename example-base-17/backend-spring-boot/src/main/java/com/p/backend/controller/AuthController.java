package com.p.backend.controller;

import com.p.backend.dto.AuthResponse;
import com.p.backend.dto.LoginRequest;
import com.p.backend.dto.RegisterRequest;
import com.p.backend.entity.User;
import com.p.backend.security.JwtTokenProvider;
import com.p.backend.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("Registration attempt for username: {}", registerRequest.getUsername());
        try {
            User user = userService.register(registerRequest);
            
            String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
            
            AuthResponse response = AuthResponse.builder()
                    .message("User registered successfully")
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .success(true)
                    .token(token)
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
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        return userService.findByEmail(loginRequest.getEmail())
                .filter(user -> passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
                .filter(user -> user.isEnabled())
                .map(user -> {
                    if (user.getRole() == null) {
                        logger.warn("User {} has no role assigned", user.getUsername());
                        AuthResponse response = AuthResponse.builder()
                                .message("User role not assigned. Please contact administrator.")
                                .success(false)
                                .build();
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                    }
                    
                    logger.info("Login successful for user: {}", user.getUsername());
                    String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
                    AuthResponse response = AuthResponse.builder()
                            .message("Login successful")
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .success(true)
                            .token(token)
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    logger.warn("Login failed for email: {}", loginRequest.getEmail());
                    AuthResponse response = AuthResponse.builder()
                            .message("Invalid credentials")
                            .success(false)
                            .build();
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                });
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(org.springframework.security.core.Authentication authentication) {
        String username = authentication.getName();
        return userService.findByUsername(username)
                .map(user -> {
                    AuthResponse response = AuthResponse.builder()
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .success(true)
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}

