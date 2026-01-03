package com.p.builder.builder;

import com.p.builder.model.ApiResponse;
import com.p.builder.model.ErrorInfo;
import com.p.builder.model.Link;
import com.p.builder.model.PaginationInfo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Step Builder Pattern
 * 
 * This pattern guides the builder through steps, ensuring required fields
 * are set in the correct order. Perfect for very complex objects with
 * many required and optional fields.
 * 
 * Advantages:
 * - Type-safe step-by-step building
 * - Prevents invalid object construction
 * - Self-documenting API
 * - IDE autocomplete guidance
 */
public class StepBuilder {
	
	/**
	 * Step 1: Define response type
	 */
	public interface ResponseTypeStep {
		StatusStep success();
		StatusStep error();
		StatusStep custom();
	}
	
	/**
	 * Step 2: Set status information
	 */
	public interface StatusStep {
		StatusCodeStep withStatus(String status);
		StatusCodeStep withDefaultStatus();
	}
	
	/**
	 * Step 3: Set status code
	 */
	public interface StatusCodeStep {
		MessageStep withStatusCode(int statusCode);
		MessageStep withDefaultStatusCode();
	}
	
	/**
	 * Step 4: Set message
	 */
	public interface MessageStep {
		DataStep withMessage(String message);
		DataStep withDefaultMessage();
	}
	
	/**
	 * Step 5: Set data (optional)
	 */
	public interface DataStep {
		DataStep withData(Object data);
		DataStep withItems(List<?> items);
		OptionalStep withoutData();
	}
	
	/**
	 * Step 6: Optional fields
	 */
	public interface OptionalStep {
		OptionalStep withMetadata(String key, Object value);
		OptionalStep withPagination(PaginationInfo pagination);
		OptionalStep withPagination(int page, int size, long total);
		OptionalStep withError(ErrorInfo error);
		OptionalStep withLink(String rel, String href, String method);
		OptionalStep withTimestamp(LocalDateTime timestamp);
		BuildStep build();
	}
	
	/**
	 * Final step: Build
	 */
	public interface BuildStep {
		ApiResponse<?> build();
	}
	
	/**
	 * Implementation
	 */
	private static class StepBuilderImpl implements 
		ResponseTypeStep, StatusStep, StatusCodeStep, MessageStep, 
		DataStep, OptionalStep, BuildStep {
		
		private String status;
		private int statusCode;
		private String message;
		private Object data;
		private List<?> items;
		private Map<String, Object> metadata = new HashMap<>();
		private LocalDateTime timestamp;
		private PaginationInfo pagination;
		private ErrorInfo error;
		private List<Link> links = new ArrayList<>();
		
		@Override
		public StatusStep success() {
			this.status = "success";
			this.statusCode = 200;
			return this;
		}
		
		@Override
		public StatusStep error() {
			this.status = "error";
			this.statusCode = 500;
			return this;
		}
		
		@Override
		public StatusStep custom() {
			return this;
		}
		
		@Override
		public StatusCodeStep withStatus(String status) {
			this.status = status;
			return this;
		}
		
		@Override
		public StatusCodeStep withDefaultStatus() {
			// Status already set in success() or error()
			return this;
		}
		
		@Override
		public MessageStep withStatusCode(int statusCode) {
			this.statusCode = statusCode;
			return this;
		}
		
		@Override
		public MessageStep withDefaultStatusCode() {
			// Status code already set
			return this;
		}
		
		@Override
		public DataStep withMessage(String message) {
			this.message = message;
			return this;
		}
		
		@Override
		public DataStep withDefaultMessage() {
			this.message = status.equals("success") ? "Operation successful" : "An error occurred";
			return this;
		}
		
		@Override
		public DataStep withData(Object data) {
			this.data = data;
			return this;
		}
		
		@Override
		public DataStep withItems(List<?> items) {
			this.items = items;
			return this;
		}
		
		@Override
		public OptionalStep withoutData() {
			return this;
		}
		
		@Override
		public OptionalStep withMetadata(String key, Object value) {
			this.metadata.put(key, value);
			return this;
		}
		
		@Override
		public OptionalStep withPagination(PaginationInfo pagination) {
			this.pagination = pagination;
			return this;
		}
		
		@Override
		public OptionalStep withPagination(int page, int size, long total) {
			int totalPages = (int) Math.ceil((double) total / size);
			this.pagination = PaginationInfo.builder()
				.page(page)
				.size(size)
				.totalElements(total)
				.totalPages(totalPages)
				.hasNext(page < totalPages)
				.hasPrevious(page > 1)
				.build();
			return this;
		}
		
		@Override
		public OptionalStep withError(ErrorInfo error) {
			this.error = error;
			return this;
		}
		
		@Override
		public OptionalStep withLink(String rel, String href, String method) {
			this.links.add(Link.builder()
				.rel(rel)
				.href(href)
				.method(method)
				.build());
			return this;
		}
		
		@Override
		public OptionalStep withTimestamp(LocalDateTime timestamp) {
			this.timestamp = timestamp;
			return this;
		}
		
		@Override
		public BuildStep build() {
			return this;
		}
		
		@Override
		public ApiResponse<?> build() {
			return ApiResponse.builder()
				.status(status)
				.statusCode(statusCode)
				.message(message)
				.data(data)
				.items(items)
				.metadata(metadata.isEmpty() ? null : metadata)
				.timestamp(timestamp)
				.pagination(pagination)
				.error(error)
				.links(links.isEmpty() ? null : links)
				.build();
		}
	}
	
	/**
	 * Entry point
	 */
	public static ResponseTypeStep newBuilder() {
		return new StepBuilderImpl();
	}
}

