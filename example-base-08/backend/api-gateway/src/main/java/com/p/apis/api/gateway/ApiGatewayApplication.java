package com.p.apis.api.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouteLocator eazyBankRouteConfig(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				.route(p -> p
						.path("/spp/students/**")
						.filters( f -> f.rewritePath("/spp/students/(?<segment>.*)","/${segment}")
								//.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
						)
						.uri("lb://STUDENT"))
				.route(p -> p
						.path("/spp/books/**")
						.filters( f -> f.rewritePath("/spp/books/(?<segment>.*)","/${segment}")
//								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
						)
						.uri("lb://BOOK"))
				.route(p -> p
						.path("/spp/login/**")
						.filters( f -> f.rewritePath("/spp/login/(?<segment>.*)","/${segment}")
//								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
						)
						.uri("lb://LOGIN"))
				.route(p -> p
						.path("/spp/courses/**")
						.filters( f -> f.rewritePath("/spp/courses/(?<segment>.*)","/${segment}")
//								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
						)
						.uri("lb://COURSE"))
				.build();


	}

}
