package com.p.builder.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pagination Information
 * 
 * Example of using Lombok @Builder for simpler objects
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginationInfo {
	private int page;
	private int size;
	private long totalElements;
	private int totalPages;
	private boolean hasNext;
	private boolean hasPrevious;
}

