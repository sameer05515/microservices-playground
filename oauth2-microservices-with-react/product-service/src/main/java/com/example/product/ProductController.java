package com.example.product;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public API - no token required";
    }

    @GetMapping("/products")
    public List<String> products() {
        return List.of("Laptop", "Mobile", "Monitor");
    }
}
