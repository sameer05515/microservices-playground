package com.p.backend.service;

import com.p.backend.dto.RegisterRequest;
import com.p.backend.entity.User;
import com.p.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private RegisterRequest registerRequest;

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
    }

    @Test
    void findByUsername_Success() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByUsername("testuser");

        // Then
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void findByUsername_NotFound() {
        // Given
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByUsername("nonexistent");

        // Then
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    void register_Success() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encodedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.register(registerRequest);

        // Then
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("USER", result.getRole());
        assertTrue(result.isEnabled());
        assertNotNull(result.getCreatedAt());
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_UsernameExists() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(registerRequest)
        );
        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_EmailExists() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(registerRequest)
        );
        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername("testuser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getAllUsers_Success() {
        // Given
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.getAllUsers();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).getUsername());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getAllUsers_EmptyList() {
        // Given
        when(userRepository.findAll()).thenReturn(List.of());

        // When
        List<User> result = userService.getAllUsers();

        // Then
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void changePassword_Success() {
        // Given
        String currentPassword = "oldpassword";
        String newPassword = "newpassword123";
        String encodedOldPassword = "$2a$10$oldencoded";
        String encodedNewPassword = "$2a$10$newencoded";

        testUser.setPassword(encodedOldPassword);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(currentPassword, encodedOldPassword)).thenReturn(true);
        when(passwordEncoder.matches(newPassword, encodedOldPassword)).thenReturn(false);
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedNewPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.changePassword("testuser", currentPassword, newPassword, passwordEncoder);

        // Then
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches(currentPassword, encodedOldPassword);
        verify(passwordEncoder, times(1)).matches(newPassword, encodedOldPassword);
        verify(passwordEncoder, times(1)).encode(newPassword);
        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(encodedNewPassword, testUser.getPassword());
        assertNotNull(testUser.getUpdatedAt());
    }

    @Test
    void changePassword_UserNotFound() {
        // Given
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.changePassword("nonexistent", "oldpassword", "newpassword", passwordEncoder)
        );
        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("nonexistent");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_IncorrectCurrentPassword() {
        // Given
        String encodedPassword = "$2a$10$encoded";
        testUser.setPassword(encodedPassword);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", encodedPassword)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.changePassword("testuser", "wrongpassword", "newpassword", passwordEncoder)
        );
        assertEquals("Current password is incorrect", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("wrongpassword", encodedPassword);
        verify(passwordEncoder, never()).matches(eq("newpassword"), anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_SamePassword() {
        // Given
        String encodedPassword = "$2a$10$encoded";
        testUser.setPassword(encodedPassword);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldpassword", encodedPassword)).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.changePassword("testuser", "oldpassword", "oldpassword", passwordEncoder)
        );
        assertEquals("New password must be different from the current password", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(2)).matches("oldpassword", encodedPassword); // Called twice in service
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void resetPasswordByAdmin_Success() {
        // Given
        String newPassword = "newpassword123";
        String encodedOldPassword = "$2a$10$oldencoded";
        String encodedNewPassword = "$2a$10$newencoded";

        testUser.setPassword(encodedOldPassword);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(newPassword, encodedOldPassword)).thenReturn(false);
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedNewPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.resetPasswordByAdmin("testuser", newPassword);

        // Then
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches(newPassword, encodedOldPassword);
        verify(passwordEncoder, times(1)).encode(newPassword);
        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(encodedNewPassword, testUser.getPassword());
        assertNotNull(testUser.getUpdatedAt());
    }

    @Test
    void resetPasswordByAdmin_UserNotFound() {
        // Given
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.resetPasswordByAdmin("nonexistent", "newpassword")
        );
        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("nonexistent");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void resetPasswordByAdmin_SamePassword() {
        // Given
        String encodedPassword = "$2a$10$encoded";
        testUser.setPassword(encodedPassword);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("samepassword", encodedPassword)).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.resetPasswordByAdmin("testuser", "samepassword")
        );
        assertEquals("New password must be different from the current password", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("samepassword", encodedPassword);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}

