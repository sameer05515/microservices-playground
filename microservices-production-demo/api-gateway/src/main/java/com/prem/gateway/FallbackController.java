package com.prem.gateway;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/order")
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Map<String, Object> orderFallback() {
        return Map.of(
                "service", "order-service",
                "message", "Order service is temporarily unavailable",
                "fallback", true
        );
    }

    @GetMapping("/product")
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Map<String, Object> productFallback() {
        return Map.of(
                "service", "product-service",
                "message", "Product service is temporarily unavailable",
                "fallback", true
        );
    }
}
