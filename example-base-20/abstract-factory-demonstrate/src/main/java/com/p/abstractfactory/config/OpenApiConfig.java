package com.p.abstractfactory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Abstract Factory Pattern - Database Integration API")
						.version("1.0.0")
						.description("REST API demonstrating Abstract Factory Pattern for integrating multiple database systems (MySQL, PostgreSQL, MongoDB)")
						.contact(new Contact()
								.name("Abstract Factory Demo")
								.email("demo@example.com")));
	}
}

