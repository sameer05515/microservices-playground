package com.prem.order;

import org.springframework.context.annotation.*;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain security(ServerHttpSecurity h) {
        return h.csrf(ServerHttpSecurity.CsrfSpec::disable).authorizeExchange(e -> e.pathMatchers("/actuator/health").permitAll().pathMatchers("/orders/admin/**").hasRole("ADMIN").pathMatchers("/orders/**").hasAnyRole("USER", "ADMIN").anyExchange().authenticated()).oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(new KeycloakRoleConverter()))).build();
    }
}
