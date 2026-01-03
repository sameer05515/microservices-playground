package com.prem.order;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.reactor.circuitbreaker.operator.CircuitBreakerOperator;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryRegistry;
import io.github.resilience4j.reactor.retry.RetryOperator;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration;

@Service
public class ProductClient {
 private final WebClient.Builder builder;
 private final CircuitBreaker circuitBreaker;
 private final Retry retry;

 public ProductClient(WebClient.Builder builder,CircuitBreakerRegistry cbRegistry,RetryRegistry retryRegistry){
   this.builder=builder;
   this.circuitBreaker=cbRegistry.circuitBreaker("productService");
   this.retry=retryRegistry.retry("productService");
 }

 public Mono<Product> getProduct(Long id){
   return builder.build().get()
     .uri("http://PRODUCT-SERVICE/products/{id}",id)
     .retrieve()
     .bodyToMono(Product.class)
     .timeout(Duration.ofSeconds(2))
     .transformDeferred(RetryOperator.of(retry))
     .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
     .onErrorResume(ex -> Mono.just(fallback(id,ex)));
 }

 private Product fallback(Long id,Throwable ex){return new Product(id,"Fallback Product",0.0);}
 public record Product(Long id,String name,double price){}
}
