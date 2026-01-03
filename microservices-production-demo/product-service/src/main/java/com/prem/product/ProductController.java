package com.prem.product;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) throws InterruptedException {
        if (id == 999L) {
            throw new IllegalStateException("Intentional product-service failure");
        }

        if (id == 888L) {
            Thread.sleep(5000);
        }

        return new Product(id, "Laptop", 79990.0);
    }

    record Product(Long id, String name, double price) {}
}
