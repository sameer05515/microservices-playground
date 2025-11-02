package com.p.backend.controller;

import com.p.backend.dto.AuthResponse;
import com.p.backend.dto.ChangePasswordRequest;
import com.p.backend.dto.ChangePasswordResponse;
import com.p.backend.dto.LoginRequest;
import com.p.backend.dto.RegisterRequest;
import com.p.backend.entity.User;
import com.p.backend.security.JwtTokenProvider;
import com.p.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
@Tag(name = "Authentication", description = "API endpoints for user authentication and registration")
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

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account with username, password, and email"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input or user already exists",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            )
    })
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

    @Operation(
            summary = "Login user",
            description = "Authenticates a user with username and password"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid username or password",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            )
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for username: {}", loginRequest.getUsername());
        
        return userService.findByUsername(loginRequest.getUsername())
                .filter(user -> passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
                .filter(user -> user.isEnabled())
                .map(user -> {
                    logger.info("Login successful for user: {}", user.getUsername());
                    String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());
                    AuthResponse response = AuthResponse.builder()
                            .message("Login successful")
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .success(true)
                            .token(token)
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

    @Operation(
            summary = "Change password",
            description = "Changes the password for the currently logged-in user. Requires authentication."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password changed successfully",
                    content = @Content(schema = @Schema(implementation = ChangePasswordResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input or password mismatch",
                    content = @Content(schema = @Schema(implementation = ChangePasswordResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid current password or not authenticated",
                    content = @Content(schema = @Schema(implementation = ChangePasswordResponse.class))
            )
    })
    @PostMapping("/change-password")
    public ResponseEntity<ChangePasswordResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {
        String username = authentication.getName();
        logger.info("Password change attempt for user: {}", username);

        try {
            // Validate that new password and confirmation match
            if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
                logger.warn("Password change failed for user {}: passwords do not match", username);
                ChangePasswordResponse response = ChangePasswordResponse.builder()
                        .message("New password and confirmation password do not match")
                        .success(false)
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            userService.changePassword(
                    username,
                    changePasswordRequest.getCurrentPassword(),
                    changePasswordRequest.getNewPassword(),
                    passwordEncoder
            );

            logger.info("Password changed successfully for user: {}", username);
            ChangePasswordResponse response = ChangePasswordResponse.builder()
                    .message("Password changed successfully")
                    .success(true)
                    .build();
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.warn("Password change failed for user {}: {}", username, e.getMessage());
            ChangePasswordResponse response = ChangePasswordResponse.builder()
                    .message(e.getMessage())
                    .success(false)
                    .build();
            
            // Check if it's an authentication error (wrong current password)
            if (e.getMessage().contains("incorrect")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}

