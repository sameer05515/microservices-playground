package com.p.builder.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Error Information
 * 
 * Using Lombok @Builder for nested objects
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorInfo {
	private String message;
	private String code;
	private List<String> details;
	private Map<String, String> fieldErrors;
	private String stackTrace; // Only in development
}

