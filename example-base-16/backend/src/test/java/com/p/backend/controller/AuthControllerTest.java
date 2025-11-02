package com.p.backend.controller;

import com.p.backend.dto.AuthResponse;
import com.p.backend.dto.ChangePasswordRequest;
import com.p.backend.dto.LoginRequest;
import com.p.backend.dto.RegisterRequest;
import com.p.backend.entity.User;
import com.p.backend.security.JwtTokenProvider;
import com.p.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("123")
                .username("testuser")
                .password("$2a$10$encodedpassword")
                .email("test@example.com")
                .role("USER")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("test@example.com");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");
    }

    @Test
    void register_Success() {
        // Given
        when(userService.register(any(RegisterRequest.class))).thenReturn(testUser);

        // When
        ResponseEntity<AuthResponse> response = authController.register(registerRequest);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("User registered successfully", response.getBody().getMessage());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals("USER", response.getBody().getRole());
        verify(userService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void register_UsernameExists() {
        // Given
        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new IllegalArgumentException("Username already exists"));

        // When
        ResponseEntity<AuthResponse> response = authController.register(registerRequest);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Username already exists", response.getBody().getMessage());
        verify(userService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void register_EmailExists() {
        // Given
        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new IllegalArgumentException("Email already exists"));

        // When
        ResponseEntity<AuthResponse> response = authController.register(registerRequest);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Email already exists", response.getBody().getMessage());
        verify(userService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void login_Success() {
        // Given
        String token = "jwt-token-123";
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateToken("testuser", "USER")).thenReturn(token);

        // When
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Login successful", response.getBody().getMessage());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals("USER", response.getBody().getRole());
        assertEquals(token, response.getBody().getToken());
        verify(userService, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("password123", testUser.getPassword());
        verify(jwtTokenProvider, times(1)).generateToken("testuser", "USER");
    }

    @Test
    void login_InvalidUsername() {
        // Given
        when(userService.findByUsername("testuser")).thenReturn(Optional.empty());

        // When
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Invalid username or password", response.getBody().getMessage());
        verify(userService, times(1)).findByUsername("testuser");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_InvalidPassword() {
        // Given
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(false);

        // When
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Invalid username or password", response.getBody().getMessage());
        verify(userService, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("password123", testUser.getPassword());
        verify(jwtTokenProvider, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_UserDisabled() {
        // Given
        testUser.setEnabled(false);
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);

        // When
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Invalid username or password", response.getBody().getMessage());
        verify(userService, times(1)).findByUsername("testuser");
        verify(jwtTokenProvider, never()).generateToken(anyString(), anyString());
    }

    @Test
    void changePassword_Success() {
        // Given
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setCurrentPassword("oldpassword");
        changePasswordRequest.setNewPassword("newpassword123");
        changePasswordRequest.setConfirmPassword("newpassword123");

        when(authentication.getName()).thenReturn("testuser");
        doNothing().when(userService).changePassword(
                eq("testuser"),
                eq("oldpassword"),
                eq("newpassword123"),
                any(PasswordEncoder.class)
        );

        // When
        ResponseEntity<com.p.backend.dto.ChangePasswordResponse> response =
                authController.changePassword(changePasswordRequest, authentication);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Password changed successfully", response.getBody().getMessage());
        verify(userService, times(1)).changePassword(
                eq("testuser"),
                eq("oldpassword"),
                eq("newpassword123"),
                any(PasswordEncoder.class)
        );
    }

    @Test
    void changePassword_PasswordMismatch() {
        // Given
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setCurrentPassword("oldpassword");
        changePasswordRequest.setNewPassword("newpassword123");
        changePasswordRequest.setConfirmPassword("differentpassword");

        when(authentication.getName()).thenReturn("testuser");

        // When
        ResponseEntity<com.p.backend.dto.ChangePasswordResponse> response =
                authController.changePassword(changePasswordRequest, authentication);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("New password and confirmation password do not match", response.getBody().getMessage());
        verify(userService, never()).changePassword(
                anyString(),
                anyString(),
                anyString(),
                any(PasswordEncoder.class)
        );
    }

    @Test
    void changePassword_InvalidCurrentPassword() {
        // Given
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setCurrentPassword("wrongpassword");
        changePasswordRequest.setNewPassword("newpassword123");
        changePasswordRequest.setConfirmPassword("newpassword123");

        when(authentication.getName()).thenReturn("testuser");
        doThrow(new IllegalArgumentException("Current password is incorrect"))
                .when(userService).changePassword(
                        eq("testuser"),
                        eq("wrongpassword"),
                        eq("newpassword123"),
                        any(PasswordEncoder.class)
                );

        // When
        ResponseEntity<com.p.backend.dto.ChangePasswordResponse> response =
                authController.changePassword(changePasswordRequest, authentication);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Current password is incorrect", response.getBody().getMessage());
        verify(userService, times(1)).changePassword(
                eq("testuser"),
                eq("wrongpassword"),
                eq("newpassword123"),
                any(PasswordEncoder.class)
        );
    }

    @Test
    void changePassword_UserNotFound() {
        // Given
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setCurrentPassword("oldpassword");
        changePasswordRequest.setNewPassword("newpassword123");
        changePasswordRequest.setConfirmPassword("newpassword123");

        when(authentication.getName()).thenReturn("testuser");
        doThrow(new IllegalArgumentException("User not found"))
                .when(userService).changePassword(
                        eq("testuser"),
                        eq("oldpassword"),
                        eq("newpassword123"),
                        any(PasswordEncoder.class)
                );

        // When
        ResponseEntity<com.p.backend.dto.ChangePasswordResponse> response =
                authController.changePassword(changePasswordRequest, authentication);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("User not found", response.getBody().getMessage());
        verify(userService, times(1)).changePassword(
                eq("testuser"),
                eq("oldpassword"),
                eq("newpassword123"),
                any(PasswordEncoder.class)
        );
    }
}

