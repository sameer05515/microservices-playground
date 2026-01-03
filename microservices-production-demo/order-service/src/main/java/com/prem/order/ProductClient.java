package com.prem.order;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ProductClient {

    private final RestClient restClient;

    public ProductClient(RestClient restClient) {
        this.restClient = restClient;
    }

    @Retry(name = "productService")
    @CircuitBreaker(name = "productService", fallbackMethod = "productFallback")
    public Product getProduct(Long productId) {
        return restClient.get()
                .uri("http://PRODUCT-SERVICE/products/{id}", productId)
                .retrieve()
                .body(Product.class);
    }

    public Product productFallback(Long productId, Throwable throwable) {
        return new Product(productId, "Fallback Product", 0.0);
    }

    public record Product(Long id, String name, double price) {}
}
