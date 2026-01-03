package com.prem.product;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        if (id == 999L) {
            throw new ProductUnavailableException("Product service is intentionally unavailable");
        }
        return new Product(id, "Laptop", 79990.0);
    }

    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    static class ProductUnavailableException extends RuntimeException {
        ProductUnavailableException(String message) {
            super(message);
        }
    }

    record Product(Long id, String name, double price) {}
}
