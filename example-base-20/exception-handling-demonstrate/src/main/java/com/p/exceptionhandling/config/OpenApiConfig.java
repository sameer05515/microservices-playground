package com.p.exceptionhandling.config;

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
						.title("Exception Handling Demo API")
						.version("1.0.0")
						.description("REST API demonstrating custom exception handling with @ControllerAdvice and @ExceptionHandler")
						.contact(new Contact()
								.name("Exception Handling Demo")
								.email("demo@example.com")));
	}
}

