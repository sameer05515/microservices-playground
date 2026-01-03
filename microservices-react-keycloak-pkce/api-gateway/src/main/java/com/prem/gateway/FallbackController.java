package com.prem.gateway;

import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/order")
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Map<String, Object> order() {
        return Map.of("fallback", true, "service", "order-service");
    }

    @GetMapping("/product")
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Map<String, Object> product() {
        return Map.of("fallback", true, "service", "product-service");
    }
}
