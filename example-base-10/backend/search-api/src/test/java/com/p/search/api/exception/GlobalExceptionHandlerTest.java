package com.p.search.api.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Test
    @DisplayName("Should handle RestClientException correctly")
    void handleRestClientException_Success() {
        // Given
        RestClientException exception = new RestClientException("Connection timeout");

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleRestClientException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        
        Map<String, Object> body = response.getBody();
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE.value(), body.get("status"));
        assertEquals("External Service Error", body.get("error"));
        assertTrue(((String) body.get("message")).contains("Connection timeout"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should handle NullPointerException correctly")
    void handleNullPointerException_Success() {
        // Given
        NullPointerException exception = new NullPointerException("Object is null");

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleNullPointerException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        
        Map<String, Object> body = response.getBody();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), body.get("status"));
        assertEquals("Internal Server Error", body.get("error"));
        assertTrue(((String) body.get("message")).contains("null value"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should handle IllegalArgumentException correctly")
    void handleIllegalArgumentException_Success() {
        // Given
        IllegalArgumentException exception = new IllegalArgumentException("Invalid parameter");

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleIllegalArgumentException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        
        Map<String, Object> body = response.getBody();
        assertEquals(HttpStatus.BAD_REQUEST.value(), body.get("status"));
        assertEquals("Bad Request", body.get("error"));
        assertEquals("Invalid parameter", body.get("message"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should handle generic Exception correctly")
    void handleGenericException_Success() {
        // Given
        RuntimeException exception = new RuntimeException("Unexpected error occurred");

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleGenericException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        
        Map<String, Object> body = response.getBody();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), body.get("status"));
        assertEquals("Internal Server Error", body.get("error"));
        assertTrue(((String) body.get("message")).contains("Unexpected error occurred"));
        assertNotNull(body.get("timestamp"));
    }

    @Test
    @DisplayName("Should include timestamp in error response")
    void handleException_IncludesTimestamp() {
        // Given
        Exception exception = new Exception("Test exception");
        LocalDateTime beforeTime = LocalDateTime.now();

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleGenericException(exception);
        LocalDateTime afterTime = LocalDateTime.now();

        // Then
        assertNotNull(response.getBody());
        Object timestamp = response.getBody().get("timestamp");
        assertNotNull(timestamp);
        assertTrue(timestamp instanceof LocalDateTime);
        
        LocalDateTime responseTime = (LocalDateTime) timestamp;
        assertTrue(responseTime.isAfter(beforeTime.minusSeconds(1)) || 
                   responseTime.isEqual(beforeTime.minusSeconds(1)));
        assertTrue(responseTime.isBefore(afterTime.plusSeconds(1)) || 
                   responseTime.isEqual(afterTime.plusSeconds(1)));
    }

    @Test
    @DisplayName("Should handle exception with null message")
    void handleException_NullMessage() {
        // Given
        Exception exception = new Exception((String) null);

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleGenericException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().get("message"));
    }

    @Test
    @DisplayName("Should handle RestClientException with null message")
    void handleRestClientException_NullMessage() {
        // Given
        RestClientException exception = new RestClientException((String) null);

        // When
        ResponseEntity<Map<String, Object>> response = 
                globalExceptionHandler.handleRestClientException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().get("message"));
    }
}

