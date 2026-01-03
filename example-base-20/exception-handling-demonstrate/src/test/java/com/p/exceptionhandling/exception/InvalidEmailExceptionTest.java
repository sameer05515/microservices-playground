package com.p.exceptionhandling.exception;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("InvalidEmailException Tests")
class InvalidEmailExceptionTest {
	
	@Test
	@DisplayName("Exception has correct HTTP status")
	void testHttpStatus() {
		InvalidEmailException ex = new InvalidEmailException("invalid@");
		assertEquals(HttpStatus.BAD_REQUEST, ex.getHttpStatus());
	}
	
	@Test
	@DisplayName("Exception has correct error code")
	void testErrorCode() {
		InvalidEmailException ex = new InvalidEmailException("invalid@");
		assertEquals("INVALID_EMAIL", ex.getErrorCode());
	}
	
	@Test
	@DisplayName("Exception contains email in parameters")
	void testParameters() {
		InvalidEmailException ex = new InvalidEmailException("invalid@");
		assertTrue(ex.getParameters().containsKey("email"));
		assertEquals("invalid@", ex.getParameters().get("email"));
	}
	
	@Test
	@DisplayName("Exception supports dynamic parameters")
	void testDynamicParameters() {
		InvalidEmailException ex = new InvalidEmailException("invalid@")
			.withParameter("field", "email")
			.withParameter("customParam", "customValue");
		
		assertTrue(ex.getParameters().containsKey("field"));
		assertTrue(ex.getParameters().containsKey("customParam"));
		assertEquals("customValue", ex.getParameters().get("customParam"));
	}
	
	@Test
	@DisplayName("Exception with reason includes reason in parameters")
	void testExceptionWithReason() {
		InvalidEmailException ex = new InvalidEmailException("invalid@", "Missing domain");
		assertTrue(ex.getParameters().containsKey("reason"));
		assertEquals("Missing domain", ex.getParameters().get("reason"));
	}
}

