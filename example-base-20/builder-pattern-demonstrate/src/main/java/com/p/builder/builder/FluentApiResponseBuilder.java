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
 * Fluent Builder Pattern Implementation
 * 
 * This demonstrates a more advanced fluent builder with:
 * - Method chaining
 * - Type-safe building
 * - Intermediate validation
 * - Self-documenting API
 */
public class FluentApiResponseBuilder<T> {
	
	private String status;
	private int statusCode;
	private String message;
	private T data;
	private List<T> items;
	private Map<String, Object> metadata = new HashMap<>();
	private LocalDateTime timestamp;
	private PaginationInfo pagination;
	private ErrorInfo error;
	private List<Link> links = new ArrayList<>();
	
	/**
	 * Start building a success response
	 */
	public static <T> FluentApiResponseBuilder<T> success() {
		FluentApiResponseBuilder<T> builder = new FluentApiResponseBuilder<>();
		builder.status = "success";
		builder.statusCode = 200;
		builder.message = "Operation successful";
		return builder;
	}
	
	/**
	 * Start building an error response
	 */
	public static <T> FluentApiResponseBuilder<T> error(String message) {
		FluentApiResponseBuilder<T> builder = new FluentApiResponseBuilder<>();
		builder.status = "error";
		builder.statusCode = 500;
		builder.message = message;
		return builder;
	}
	
	/**
	 * Start building a custom response
	 */
	public static <T> FluentApiResponseBuilder<T> custom() {
		return new FluentApiResponseBuilder<>();
	}
	
	// Fluent setters
	public FluentApiResponseBuilder<T> withStatus(String status) {
		this.status = status;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withStatusCode(int statusCode) {
		this.statusCode = statusCode;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withMessage(String message) {
		this.message = message;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withData(T data) {
		this.data = data;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withItems(List<T> items) {
		this.items = items;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withMetadata(String key, Object value) {
		this.metadata.put(key, value);
		return this;
	}
	
	public FluentApiResponseBuilder<T> withMetadata(Map<String, Object> metadata) {
		this.metadata.putAll(metadata);
		return this;
	}
	
	public FluentApiResponseBuilder<T> withTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withPagination(PaginationInfo pagination) {
		this.pagination = pagination;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withPagination(int page, int size, long total) {
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
	
	public FluentApiResponseBuilder<T> withError(ErrorInfo error) {
		this.error = error;
		return this;
	}
	
	public FluentApiResponseBuilder<T> withError(String message, String code) {
		this.error = ErrorInfo.builder()
			.message(message)
			.code(code)
			.build();
		return this;
	}
	
	public FluentApiResponseBuilder<T> withLink(String rel, String href, String method) {
		this.links.add(Link.builder()
			.rel(rel)
			.href(href)
			.method(method)
			.build());
		return this;
	}
	
	public FluentApiResponseBuilder<T> withLinks(List<Link> links) {
		this.links.addAll(links);
		return this;
	}
	
	/**
	 * Build the response
	 */
	public ApiResponse<T> build() {
		return ApiResponse.<T>builder()
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

