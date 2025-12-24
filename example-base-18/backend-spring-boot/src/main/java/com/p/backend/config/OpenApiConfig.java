package com.p.backend.config;

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
                        .title("Directory/Topic Management API")
                        .version("1.0.0")
                        .description("REST API for managing hierarchical directory structure with sub-directories and topics")
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@example.com")));
    }
}

