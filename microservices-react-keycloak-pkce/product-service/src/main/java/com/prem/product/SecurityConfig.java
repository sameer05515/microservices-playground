package com.prem.product;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain security(HttpSecurity h) throws Exception {
        return h.csrf(c -> c.disable()).authorizeHttpRequests(a -> a.requestMatchers("/actuator/health").permitAll().requestMatchers("/products/**").hasAnyRole("USER", "ADMIN").anyRequest().authenticated()).oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(new KeycloakRoleConverter()))).build();
    }
}
