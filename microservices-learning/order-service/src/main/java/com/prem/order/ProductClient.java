package com.prem.order;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {

    @GetMapping("/products/{id}")
    RemoteProduct findById(@PathVariable("id") String id);

    @PutMapping("/products/{id}/stock")
    RemoteProduct updateStock(
            @PathVariable("id") String id,
            @RequestParam("quantity") int quantity
    );
}
