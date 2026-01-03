package com.p.builder.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Address nested object
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
	private String street;
	private String city;
	private String state;
	private String zipCode;
	private String country;
}

