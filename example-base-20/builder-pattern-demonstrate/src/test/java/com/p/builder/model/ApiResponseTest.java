package com.p.builder.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ApiResponse Builder Tests")
class ApiResponseTest {
	
	@Test
	@DisplayName("Builder creates immutable response")
	void testBuilderCreatesImmutableResponse() {
		ApiResponse<String> response = ApiResponse.<String>builder()
			.status("success")
			.statusCode(200)
			.message("Test message")
			.data("test data")
			.build();
		
		assertNotNull(response);
		assertEquals("success", response.getStatus());
		assertEquals(200, response.getStatusCode());
		assertEquals("Test message", response.getMessage());
		assertEquals("test data", response.getData());
	}
	
	@Test
	@DisplayName("Builder validates required fields")
	void testBuilderValidation() {
		// Missing status should throw exception
		assertThrows(IllegalStateException.class, () -> {
			ApiResponse.builder()
				.statusCode(200)
				.message("Test")
				.build();
		});
	}
	
	@Test
	@DisplayName("Builder validates status code range")
	void testBuilderStatusCodeValidation() {
		// Invalid status code should throw exception
		assertThrows(IllegalStateException.class, () -> {
			ApiResponse.builder()
				.status("success")
				.statusCode(999) // Invalid
				.build();
		});
	}
	
	@Test
	@DisplayName("Convenience method for success")
	void testSuccessConvenienceMethod() {
		ApiResponse<String> response = ApiResponse.success("test data");
		
		assertEquals("success", response.getStatus());
		assertEquals(200, response.getStatusCode());
		assertEquals("Operation successful", response.getMessage());
		assertEquals("test data", response.getData());
	}
	
	@Test
	@DisplayName("Convenience method for error")
	void testErrorConvenienceMethod() {
		ApiResponse<String> response = ApiResponse.error("Not found", 404);
		
		assertEquals("error", response.getStatus());
		assertEquals(404, response.getStatusCode());
		assertEquals("Not found", response.getMessage());
		assertNotNull(response.getError());
	}
	
	@Test
	@DisplayName("Builder handles optional fields")
	void testOptionalFields() {
		ApiResponse<String> response = ApiResponse.<String>builder()
			.status("success")
			.statusCode(200)
			.message("Test")
			.data("data")
			// Optional fields can be omitted
			.build();
		
		assertNull(response.getPagination());
		assertNull(response.getError());
		assertNull(response.getLinks());
	}
	
	@Test
	@DisplayName("Builder with all fields")
	void testBuilderWithAllFields() {
		PaginationInfo pagination = PaginationInfo.builder()
			.page(1)
			.size(10)
			.totalElements(100)
			.totalPages(10)
			.build();
		
		ErrorInfo error = ErrorInfo.builder()
			.message("Error message")
			.code("ERROR_CODE")
			.build();
		
		List<Link> links = Arrays.asList(
			Link.builder().rel("self").href("/api/test").method("GET").build()
		);
		
		ApiResponse<String> response = ApiResponse.<String>builder()
			.status("success")
			.statusCode(200)
			.message("Test")
			.data("data")
			.pagination(pagination)
			.error(error)
			.links(links)
			.build();
		
		assertNotNull(response.getPagination());
		assertNotNull(response.getError());
		assertNotNull(response.getLinks());
		assertEquals(1, response.getLinks().size());
	}
}

