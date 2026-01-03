package com.prem.order;

import java.time.Duration;
import io.github.resilience4j.circuitbreaker.*;
import io.github.resilience4j.reactor.circuitbreaker.operator.CircuitBreakerOperator;
import io.github.resilience4j.reactor.retry.RetryOperator;
import io.github.resilience4j.retry.*;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ProductClient {

    private final WebClient.Builder b;
    private final CircuitBreaker cb;
    private final Retry retry;

    public ProductClient(WebClient.Builder b, CircuitBreakerRegistry c, RetryRegistry r) {
        this.b = b;
        cb = c.circuitBreaker("productService");
        retry = r.retry("productService");
    }

    public Mono<Product> getProduct(Long id) {
        return ReactiveSecurityContextHolder.getContext().map(x -> x.getAuthentication()).cast(JwtAuthenticationToken.class).flatMap(a -> b.build().get().uri("http://PRODUCT-SERVICE/products/{id}", id).headers(h -> h.setBearerAuth(a.getToken().getTokenValue())).retrieve().bodyToMono(Product.class).timeout(Duration.ofSeconds(2)).transformDeferred(RetryOperator.of(retry)).transformDeferred(CircuitBreakerOperator.of(cb))).onErrorResume(x -> Mono.just(new Product(id, "Fallback Product", 0)));
    }

    record Product(Long id, String name, double price) {
    }
}
