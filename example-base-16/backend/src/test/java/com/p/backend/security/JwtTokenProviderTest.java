package com.p.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private static final String SECRET_KEY = "your-256-bit-secret-key-for-jwt-token-generation-must-be-at-least-32-characters-long";
    private static final long EXPIRATION = 86400000L; // 24 hours

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(SECRET_KEY, EXPIRATION);
    }

    @Test
    void generateToken_Success() {
        // When
        String token = jwtTokenProvider.generateToken("testuser", "USER");

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void generateToken_DifferentRoles() {
        // When
        String userToken = jwtTokenProvider.generateToken("testuser", "USER");
        String adminToken = jwtTokenProvider.generateToken("admin", "ADMIN");

        // Then
        assertNotNull(userToken);
        assertNotNull(adminToken);
        assertNotEquals(userToken, adminToken);
    }

    @Test
    void getUsernameFromToken_Success() {
        // Given
        String token = jwtTokenProvider.generateToken("testuser", "USER");

        // When
        String username = jwtTokenProvider.getUsernameFromToken(token);

        // Then
        assertEquals("testuser", username);
    }

    @Test
    void getRoleFromToken_Success() {
        // Given
        String token = jwtTokenProvider.generateToken("testuser", "USER");

        // When
        String role = jwtTokenProvider.getRoleFromToken(token);

        // Then
        assertEquals("USER", role);
    }

    @Test
    void getRoleFromToken_Admin() {
        // Given
        String token = jwtTokenProvider.generateToken("admin", "ADMIN");

        // When
        String role = jwtTokenProvider.getRoleFromToken(token);

        // Then
        assertEquals("ADMIN", role);
    }

    @Test
    void getExpirationDateFromToken_Success() {
        // Given
        String token = jwtTokenProvider.generateToken("testuser", "USER");

        // When
        Date expirationDate = jwtTokenProvider.getExpirationDateFromToken(token);

        // Then
        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    void validateToken_ValidToken() {
        // Given
        String token = jwtTokenProvider.generateToken("testuser", "USER");

        // When
        Boolean isValid = jwtTokenProvider.validateToken(token);

        // Then
        assertTrue(isValid);
    }

    @Test
    void validateToken_InvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";

        // When
        Boolean isValid = jwtTokenProvider.validateToken(invalidToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    void validateToken_EmptyToken() {
        // Given
        String emptyToken = "";

        // When
        Boolean isValid = jwtTokenProvider.validateToken(emptyToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    void validateToken_NullToken() {
        // Given
        String nullToken = null;

        // When
        Boolean isValid = jwtTokenProvider.validateToken(nullToken);

        // Then - null token should be invalid
        assertFalse(isValid);
    }

    @Test
    void validateToken_WrongSecret() {
        // Given
        String token = jwtTokenProvider.generateToken("testuser", "USER");
        JwtTokenProvider differentProvider = new JwtTokenProvider("different-secret-key-must-be-at-least-32-characters-long", EXPIRATION);

        // When
        Boolean isValid = differentProvider.validateToken(token);

        // Then
        assertFalse(isValid);
    }

    @Test
    void tokenContainsCorrectClaims() {
        // Given
        String username = "testuser";
        String role = "ADMIN";
        String token = jwtTokenProvider.generateToken(username, role);

        // When
        String extractedUsername = jwtTokenProvider.getUsernameFromToken(token);
        String extractedRole = jwtTokenProvider.getRoleFromToken(token);

        // Then
        assertEquals(username, extractedUsername);
        assertEquals(role, extractedRole);
    }
}

