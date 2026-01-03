package com.p.builder.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * User Domain Model
 * 
 * Demonstrates Lombok @Builder for domain entities
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	private Long id;
	private String username;
	private String email;
	private String firstName;
	private String lastName;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<String> roles;
	private Address address;
	private boolean active;
}

