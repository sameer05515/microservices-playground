package com.p.builder.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * HATEOAS Link
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Link {
	private String rel;
	private String href;
	private String method;
}

