package com.example.gateway;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class GatewayConfig {
 @Bean RouteLocator routes(RouteLocatorBuilder b){return b.routes().route("todo-service",r->r.path("/api/**").filters(f->f.circuitBreaker(c->c.setName("todoServiceCircuitBreaker").setFallbackUri("forward:/fallback/todo"))).uri("lb://TODO-SERVICE")).build();}
}
