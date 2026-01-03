package com.p.exceptionhandling.handler;

import com.p.exceptionhandling.dto.ErrorResponse;
import com.p.exceptionhandling.exception.InvalidEmailException;
import com.p.exceptionhandling.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {
	
	private GlobalExceptionHandler handler;
	private HttpServletRequest request;
	
	@BeforeEach
	void setUp() {
		handler = new GlobalExceptionHandler();
		request = mock(HttpServletRequest.class);
		when(request.getRequestURI()).thenReturn("/api/users");
	}
	
	@Test
	@DisplayName("Handles InvalidEmailException correctly")
	void testHandleInvalidEmailException() {
		InvalidEmailException ex = new InvalidEmailException("invalid@");
		
		ResponseEntity<ErrorResponse> response = handler.handleInvalidEmailException(ex, request);
		
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals("INVALID_EMAIL", response.getBody().getErrorCode());
		assertTrue(response.getBody().getMessage().contains("invalid@"));
		assertTrue(response.getBody().getParameters().containsKey("email"));
	}
	
	@Test
	@DisplayName("Handles ResourceNotFoundException correctly")
	void testHandleResourceNotFoundException() {
		ResourceNotFoundException ex = new ResourceNotFoundException("User", "123");
		
		ResponseEntity<ErrorResponse> response = handler.handleResourceNotFoundException(ex, request);
		
		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
		assertNotNull(response.getBody());
		assertEquals("RESOURCE_NOT_FOUND", response.getBody().getErrorCode());
		assertTrue(response.getBody().getParameters().containsKey("resourceType"));
		assertTrue(response.getBody().getParameters().containsKey("resourceId"));
	}
	
	@Test
	@DisplayName("ErrorResponse includes path information")
	void testErrorResponseIncludesPath() {
		InvalidEmailException ex = new InvalidEmailException("invalid@");
		
		ResponseEntity<ErrorResponse> response = handler.handleInvalidEmailException(ex, request);
		
		assertNotNull(response.getBody());
		assertEquals("/api/users", response.getBody().getPath());
	}
	
	@Test
	@DisplayName("ErrorResponse includes timestamp")
	void testErrorResponseIncludesTimestamp() {
		InvalidEmailException ex = new InvalidEmailException("invalid@");
		
		ResponseEntity<ErrorResponse> response = handler.handleInvalidEmailException(ex, request);
		
		assertNotNull(response.getBody());
		assertNotNull(response.getBody().getTimestamp());
	}
}

