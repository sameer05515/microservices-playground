package com.p.apis.login.controller;

import com.p.apis.login.dto.TokenValidationRequest;
import com.p.apis.login.dto.TokenValidationResponse;
import com.p.apis.login.entity.User;
import com.p.apis.login.security.JwtUtil;
import com.p.apis.login.service.BackupService;
import com.p.apis.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private BackupService backupService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) throws IOException {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }
        user.setRole("USER");
        userService.saveUser(user);
        backupService.createBackup();
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password.");
        }
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        // Invalidate the JWT token (handle it in client-side)
        return ResponseEntity.ok("Logged out successfully.");
    }

    @GetMapping("/users")
    public ResponseEntity<?> allUsers() {
        // Invalidate the JWT token (handle it in client-side)
        List<User> userList= userService.findAllUsers();
        return ResponseEntity.ok(userList);
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody TokenValidationRequest tokenValidationRequest) {
        boolean isValid = jwtUtil.validateToken(tokenValidationRequest.getToken());
        return ResponseEntity.ok(new TokenValidationResponse(isValid));
    }
}





