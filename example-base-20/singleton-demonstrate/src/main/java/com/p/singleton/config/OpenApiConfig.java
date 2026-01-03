package com.p.singleton.config;

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
                        .title("Singleton Pattern Demo API")
                        .version("1.0.0")
                        .description("REST API demonstrating thread-safe Singleton pattern implementations using Java 8 features")
                        .contact(new Contact()
                                .name("Singleton Pattern Demo")
                                .email("demo@example.com")));
    }
}

