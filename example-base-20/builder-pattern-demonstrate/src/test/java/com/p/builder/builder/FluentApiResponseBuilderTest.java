package com.p.builder.builder;

import com.p.builder.model.ApiResponse;
import com.p.builder.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Fluent Builder Tests")
class FluentApiResponseBuilderTest {
	
	@Test
	@DisplayName("Fluent builder creates success response")
	void testFluentSuccessBuilder() {
		ApiResponse<String> response = FluentApiResponseBuilder.<String>success()
			.withMessage("Custom message")
			.withData("test data")
			.build();
		
		assertEquals("success", response.getStatus());
		assertEquals(200, response.getStatusCode());
		assertEquals("Custom message", response.getMessage());
		assertEquals("test data", response.getData());
	}
	
	@Test
	@DisplayName("Fluent builder creates error response")
	void testFluentErrorBuilder() {
		ApiResponse<String> response = FluentApiResponseBuilder.<String>error("Something went wrong")
			.withStatusCode(500)
			.withError("ERROR_CODE", "Detailed error message")
			.build();
		
		assertEquals("error", response.getStatus());
		assertEquals(500, response.getStatusCode());
		assertEquals("Something went wrong", response.getMessage());
		assertNotNull(response.getError());
	}
	
	@Test
	@DisplayName("Fluent builder with pagination")
	void testFluentBuilderWithPagination() {
		List<User> users = Arrays.asList(
			User.builder().id(1L).username("user1").build(),
			User.builder().id(2L).username("user2").build()
		);
		
		ApiResponse<User> response = FluentApiResponseBuilder.<User>success()
			.withItems(users)
			.withPagination(1, 10, 25)
			.build();
		
		assertNotNull(response.getPagination());
		assertEquals(1, response.getPagination().getPage());
		assertEquals(10, response.getPagination().getSize());
		assertEquals(25, response.getPagination().getTotalElements());
		assertTrue(response.getPagination().isHasNext());
	}
	
	@Test
	@DisplayName("Fluent builder with metadata")
	void testFluentBuilderWithMetadata() {
		ApiResponse<String> response = FluentApiResponseBuilder.<String>success()
			.withData("data")
			.withMetadata("key1", "value1")
			.withMetadata("key2", "value2")
			.build();
		
		assertNotNull(response.getMetadata());
		assertEquals("value1", response.getMetadata().get("key1"));
		assertEquals("value2", response.getMetadata().get("key2"));
	}
	
	@Test
	@DisplayName("Fluent builder with links")
	void testFluentBuilderWithLinks() {
		ApiResponse<String> response = FluentApiResponseBuilder.<String>success()
			.withData("data")
			.withLink("self", "/api/test", "GET")
			.withLink("update", "/api/test", "PUT")
			.build();
		
		assertNotNull(response.getLinks());
		assertEquals(2, response.getLinks().size());
		assertEquals("self", response.getLinks().get(0).getRel());
	}
}

