package com.p.parctice.order.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "http://localhost:8082")
public interface ProductServiceClient {
    @GetMapping("/products/{id}")
    Object getProductById(@PathVariable Long id);
}