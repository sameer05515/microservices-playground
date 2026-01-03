package com.p.backend.controller;

import com.p.backend.dto.DashboardResponse;
import com.p.backend.dto.UpdateUserRequest;
import com.p.backend.dto.UserResponse;
import com.p.backend.entity.Role;
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
@RequestMapping("/api/manage")
@AllowRoles({"ADMIN", "MANAGER"})
public class ManagerController {

    private static final Logger logger = LoggerFactory.getLogger(ManagerController.class);

    private final UserService userService;

    public ManagerController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers() {
        // Managers can only see USER role users
        List<User> users = userService.findByRole(Role.USER);
        List<UserResponse> userResponses = users.stream()
                .limit(50) // Limit results
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Limited users retrieved successfully");
        response.put("count", userResponses.size());
        response.put("users", userResponses);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            User user = userService.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Managers cannot update ADMIN or MANAGER accounts
            if (user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Forbidden: Cannot update admin or manager accounts");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            User updatedUser = userService.updateUser(id, request.getUsername(), request.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully");
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        DashboardResponse response = DashboardResponse.builder()
                .message("Welcome to Manager Dashboard")
                .username(authentication.getName())
                .role(authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                .access("Limited resource access - can read/update USER accounts only")
                .build();
        return ResponseEntity.ok(response);
    }
}

