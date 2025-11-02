package com.p.backend.controller;

import com.p.backend.dto.ChangePasswordResponse;
import com.p.backend.dto.ResetPasswordRequest;
import com.p.backend.dto.UserResponse;
import com.p.backend.entity.User;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "API endpoints for user management (Admin only)")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Get all users",
            description = "Retrieves a list of all users. This endpoint is only accessible to users with ADMIN role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved users",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied. Admin role required."
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized. Valid JWT token required."
            )
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        logger.info("Getting all users - Admin access required");
        List<User> users = userService.getAllUsers();
        
        List<UserResponse> userResponses = users.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .enabled(user.isEnabled())
                        .build())
                .collect(Collectors.toList());
        
        logger.info("Retrieved {} users", userResponses.size());
        return ResponseEntity.ok(userResponses);
    }

    @Operation(
            summary = "Reset user password (Admin only)",
            description = "Resets the password for a specified user. This endpoint is only accessible to users with ADMIN role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password reset successfully",
                    content = @Content(schema = @Schema(implementation = ChangePasswordResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input or user not found",
                    content = @Content(schema = @Schema(implementation = ChangePasswordResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access denied. Admin role required."
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized. Valid JWT token required."
            )
    })
    @PostMapping("/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChangePasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        logger.info("Password reset attempt for user: {} by admin", resetPasswordRequest.getUsername());

        try {
            userService.resetPasswordByAdmin(
                    resetPasswordRequest.getUsername(),
                    resetPasswordRequest.getNewPassword()
            );

            logger.info("Password reset successfully for user: {}", resetPasswordRequest.getUsername());
            ChangePasswordResponse response = ChangePasswordResponse.builder()
                    .message("Password reset successfully for user: " + resetPasswordRequest.getUsername())
                    .success(true)
                    .build();
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.warn("Password reset failed for user {}: {}", resetPasswordRequest.getUsername(), e.getMessage());
            ChangePasswordResponse response = ChangePasswordResponse.builder()
                    .message(e.getMessage())
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}

