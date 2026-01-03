package com.p.builder.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Complex REST API Response Model
 * 
 * This represents a typical complex API response with:
 * - Status information
 * - Data payload
 * - Metadata
 * - Pagination
 * - Error details
 * - Links
 * - Timestamps
 * 
 * This is a perfect candidate for the Builder Pattern because:
 * 1. Many optional fields
 * 2. Complex nested objects
 * 3. Different response types (success, error, paginated)
 * 4. Need for immutability
 * 5. Readability and maintainability
 */
public class ApiResponse<T> {
	
	// Status fields
	private final String status;
	private final int statusCode;
	private final String message;
	
	// Data payload
	private final T data;
	private final List<T> items;
	
	// Metadata
	private final Map<String, Object> metadata;
	private final LocalDateTime timestamp;
	
	// Pagination
	private final PaginationInfo pagination;
	
	// Error information
	private final ErrorInfo error;
	
	// Links (HATEOAS)
	private final List<Link> links;
	
	// Private constructor - use Builder
	private ApiResponse(Builder<T> builder) {
		this.status = builder.status;
		this.statusCode = builder.statusCode;
		this.message = builder.message;
		this.data = builder.data;
		this.items = builder.items;
		this.metadata = builder.metadata;
		this.timestamp = builder.timestamp != null ? builder.timestamp : LocalDateTime.now();
		this.pagination = builder.pagination;
		this.error = builder.error;
		this.links = builder.links;
	}
	
	// Getters
	public String getStatus() { return status; }
	public int getStatusCode() { return statusCode; }
	public String getMessage() { return message; }
	public T getData() { return data; }
	public List<T> getItems() { return items; }
	public Map<String, Object> getMetadata() { return metadata; }
	public LocalDateTime getTimestamp() { return timestamp; }
	public PaginationInfo getPagination() { return pagination; }
	public ErrorInfo getError() { return error; }
	public List<Link> getLinks() { return links; }
	
	/**
	 * Manual Builder Pattern Implementation
	 * 
	 * Advantages:
	 * 1. Fluent API - method chaining
	 * 2. Immutability - object is immutable once built
	 * 3. Validation - can validate before building
	 * 4. Readability - self-documenting code
	 * 5. Flexibility - optional parameters handled elegantly
	 */
	public static class Builder<T> {
		private String status;
		private int statusCode;
		private String message;
		private T data;
		private List<T> items;
		private Map<String, Object> metadata;
		private LocalDateTime timestamp;
		private PaginationInfo pagination;
		private ErrorInfo error;
		private List<Link> links;
		
		public Builder<T> status(String status) {
			this.status = status;
			return this;
		}
		
		public Builder<T> statusCode(int statusCode) {
			this.statusCode = statusCode;
			return this;
		}
		
		public Builder<T> message(String message) {
			this.message = message;
			return this;
		}
		
		public Builder<T> data(T data) {
			this.data = data;
			return this;
		}
		
		public Builder<T> items(List<T> items) {
			this.items = items;
			return this;
		}
		
		public Builder<T> metadata(Map<String, Object> metadata) {
			this.metadata = metadata;
			return this;
		}
		
		public Builder<T> timestamp(LocalDateTime timestamp) {
			this.timestamp = timestamp;
			return this;
		}
		
		public Builder<T> pagination(PaginationInfo pagination) {
			this.pagination = pagination;
			return this;
		}
		
		public Builder<T> error(ErrorInfo error) {
			this.error = error;
			return this;
		}
		
		public Builder<T> links(List<Link> links) {
			this.links = links;
			return this;
		}
		
		/**
		 * Build method with validation
		 */
		public ApiResponse<T> build() {
			// Validation logic
			if (status == null) {
				throw new IllegalStateException("Status is required");
			}
			if (statusCode < 100 || statusCode >= 600) {
				throw new IllegalStateException("Invalid status code: " + statusCode);
			}
			
			return new ApiResponse<>(this);
		}
	}
	
	/**
	 * Static factory method for creating builder
	 */
	public static <T> Builder<T> builder() {
		return new Builder<>();
	}
	
	/**
	 * Convenience methods for common response types
	 */
	public static <T> ApiResponse<T> success(T data) {
		return builder()
			.status("success")
			.statusCode(200)
			.message("Operation successful")
			.data(data)
			.build();
	}
	
	public static <T> ApiResponse<T> success(List<T> items) {
		return builder()
			.status("success")
			.statusCode(200)
			.message("Operation successful")
			.items(items)
			.build();
	}
	
	public static <T> ApiResponse<T> error(String message, int statusCode) {
		return builder()
			.status("error")
			.statusCode(statusCode)
			.message(message)
			.error(new ErrorInfo(message, null))
			.build();
	}
}

