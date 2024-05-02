package com.p.libs.jwt;

import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

// import java.util.Date;
// import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    public void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "mySecretKey");
    }

    @Test
    public void testGenerateToken() {
        String token = jwtUtil.generateToken("testUser", 1L);
        assertNotNull(token);
    }

    @Test
    public void testExtractUsername() {
        String token = jwtUtil.generateToken("testUser", 1L);
        assertEquals("testUser", jwtUtil.extractUsername(token));
    }

    @Test
    public void testExtractClaim() {
        String token = jwtUtil.generateToken("testUser", 1L);
        Claims claims = jwtUtil.extractAllClaims(token);
        assertEquals("testUser", claims.getSubject());
    }

//    @Test
//    public void testIsTokenExpired() {
//        String token = createExpiredToken("testUser");
//
//        assertTrue(jwtUtil.isTokenExpired(token));
//    }

//    @Test
//    public void testIsTokenExpired_NoExceptionForExpiredToken() {
//        String token = createExpiredToken("testUser");
//
//        // This test verifies that the method does not throw an exception
//        assertDoesNotThrow(() -> jwtUtil.isTokenExpired(token));
//    }

    @Test
    public void testValidateToken() {
        String token = jwtUtil.generateToken("testUser", 1L);
        assertTrue(jwtUtil.validateToken(token, "testUser"));
    }

    // private String createExpiredToken(String username) {
    //     long currentTimeMillis = System.currentTimeMillis();
    //     Date now = new Date(currentTimeMillis);
    //     Date expiration = new Date(currentTimeMillis - 1000 * 60 * 10); // token expired 10 minutes ago

    //     return Jwts.builder()
    //             .setClaims(new HashMap<>())
    //             .setSubject(username)
    //             .setIssuedAt(new Date(currentTimeMillis - 1000 * 60 * 60)) // issued 1 hour ago
    //             .setExpiration(expiration)
    //             .signWith(SignatureAlgorithm.HS256, "mySecretKey")
    //             .compact();
    // }
}
