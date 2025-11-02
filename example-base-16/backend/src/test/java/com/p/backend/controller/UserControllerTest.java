package com.p.backend.controller;

import com.p.backend.dto.ChangePasswordResponse;
import com.p.backend.dto.ResetPasswordRequest;
import com.p.backend.dto.UserResponse;
import com.p.backend.entity.User;
import com.p.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User user1;
    private User user2;
    private List<User> users;

    @BeforeEach
    void setUp() {
        user1 = User.builder()
                .id("1")
                .username("user1")
                .email("user1@example.com")
                .role("USER")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        user2 = User.builder()
                .id("2")
                .username("admin")
                .email("admin@example.com")
                .role("ADMIN")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        users = Arrays.asList(user1, user2);
    }

    @Test
    void getAllUsers_Success() {
        // Given
        when(userService.getAllUsers()).thenReturn(users);

        // When
        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());

        UserResponse response1 = response.getBody().get(0);
        assertEquals("1", response1.getId());
        assertEquals("user1", response1.getUsername());
        assertEquals("user1@example.com", response1.getEmail());
        assertEquals("USER", response1.getRole());
        assertTrue(response1.isEnabled());

        UserResponse response2 = response.getBody().get(1);
        assertEquals("2", response2.getId());
        assertEquals("admin", response2.getUsername());
        assertEquals("admin@example.com", response2.getEmail());
        assertEquals("ADMIN", response2.getRole());
        assertTrue(response2.isEnabled());

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void getAllUsers_EmptyList() {
        // Given
        when(userService.getAllUsers()).thenReturn(List.of());

        // When
        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void resetPassword_Success() {
        // Given
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setUsername("user1");
        resetPasswordRequest.setNewPassword("newpassword123");

        doNothing().when(userService).resetPasswordByAdmin("user1", "newpassword123");

        // When
        ResponseEntity<ChangePasswordResponse> response =
                userController.resetPassword(resetPasswordRequest);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Password reset successfully for user: user1", response.getBody().getMessage());
        verify(userService, times(1)).resetPasswordByAdmin("user1", "newpassword123");
    }

    @Test
    void resetPassword_UserNotFound() {
        // Given
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setUsername("nonexistent");
        resetPasswordRequest.setNewPassword("newpassword123");

        doThrow(new IllegalArgumentException("User not found"))
                .when(userService).resetPasswordByAdmin("nonexistent", "newpassword123");

        // When
        ResponseEntity<ChangePasswordResponse> response =
                userController.resetPassword(resetPasswordRequest);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("User not found", response.getBody().getMessage());
        verify(userService, times(1)).resetPasswordByAdmin("nonexistent", "newpassword123");
    }

    @Test
    void resetPassword_SamePassword() {
        // Given
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setUsername("user1");
        resetPasswordRequest.setNewPassword("newpassword123");

        doThrow(new IllegalArgumentException("New password must be different from the current password"))
                .when(userService).resetPasswordByAdmin("user1", "newpassword123");

        // When
        ResponseEntity<ChangePasswordResponse> response =
                userController.resetPassword(resetPasswordRequest);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("New password must be different from the current password", response.getBody().getMessage());
        verify(userService, times(1)).resetPasswordByAdmin("user1", "newpassword123");
    }
}

