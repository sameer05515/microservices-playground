package com.p.apis.api.gateway.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "custom.prem")
@Setter @Getter @NoArgsConstructor @AllArgsConstructor
public class CustomConfig {

    private String validationUrl;
    private List<String> openApiEndpoints;
}
