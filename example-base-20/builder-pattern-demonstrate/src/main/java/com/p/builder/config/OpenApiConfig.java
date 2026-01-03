package com.p.builder.config;

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
						.title("Builder Pattern Demo API")
						.version("1.0.0")
						.description("REST API demonstrating Builder Pattern advantages for constructing complex REST API responses")
						.contact(new Contact()
								.name("Builder Pattern Demo")
								.email("demo@example.com")));
	}
}

