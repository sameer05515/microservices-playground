package com.p.abstractfactory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User entity model
 * Used across all database implementations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	private Long id;
	private String name;
	private String email;
}

