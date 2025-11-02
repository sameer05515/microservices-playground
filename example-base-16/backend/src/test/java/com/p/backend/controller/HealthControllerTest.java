package com.p.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    void health_Success() {
        // When
        ResponseEntity<Map<String, String>> response = healthController.health();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("backend", response.getBody().get("service"));
    }

    @Test
    void health_ResponseNotNull() {
        // When
        ResponseEntity<Map<String, String>> response = healthController.health();

        // Then
        assertNotNull(response);
        assertNotNull(response.getBody());
    }
}

