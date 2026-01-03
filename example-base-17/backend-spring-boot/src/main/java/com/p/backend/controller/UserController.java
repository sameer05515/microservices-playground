package com.p.backend.controller;

import com.p.backend.dto.ChangePasswordRequest;
import com.p.backend.dto.DashboardResponse;
import com.p.backend.dto.UpdateUserRequest;
import com.p.backend.dto.UserResponse;
import com.p.backend.entity.User;
import com.p.backend.security.AllowRoles;
import com.p.backend.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        return userService.findByUsername(authentication.getName())
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Profile retrieved successfully");
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("username", user.getUsername());
                    userData.put("email", user.getEmail());
                    userData.put("role", user.getRole().name());
                    userData.put("createdAt", user.getCreatedAt());
                    response.put("user", userData);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PatchMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            User user = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            User updatedUser = userService.updateUser(user.getId(), request.getUsername(), request.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", updatedUser.getId());
            userData.put("username", updatedUser.getUsername());
            userData.put("email", updatedUser.getEmail());
            userData.put("role", updatedUser.getRole().name());
            response.put("user", userData);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PatchMapping("/password")
    public ResponseEntity<Map<String, Object>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(
                    authentication.getName(),
                    request.getCurrentPassword(),
                    request.getNewPassword(),
                    passwordEncoder
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        DashboardResponse response = DashboardResponse.builder()
                .message("Welcome to User Dashboard")
                .username(authentication.getName())
                .role(authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                .access("Self-scope resources only")
                .build();
        return ResponseEntity.ok(response);
    }
}

