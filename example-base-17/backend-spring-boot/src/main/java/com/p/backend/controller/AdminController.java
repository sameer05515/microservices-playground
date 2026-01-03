package com.p.backend.controller;

import com.p.backend.dto.DashboardResponse;
import com.p.backend.dto.UpdateRoleRequest;
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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@AllowRoles({"ADMIN"})
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers() {
        List<User> users = userService.findAll();
        List<UserResponse> userResponses = users.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Users retrieved successfully");
        response.put("count", userResponses.size());
        response.put("users", userResponses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id) {
        return userService.findById(id)
                .map(user -> {
                    UserResponse response = UserResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .createdAt(user.getCreatedAt())
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateRoleRequest request) {
        try {
            User user = userService.updateUserRole(id, request.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User role updated successfully");
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole().name());
            response.put("user", userData);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        DashboardResponse response = DashboardResponse.builder()
                .message("Welcome to Admin Dashboard")
                .username(authentication.getName())
                .role(authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                .access("Full system access")
                .build();
        return ResponseEntity.ok(response);
    }
}

