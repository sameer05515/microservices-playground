package com.prem.product;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) throws InterruptedException {
        if (id == 999) {
            throw new IllegalStateException("Intentional failure");
        
        }if (id == 888) {
            Thread.sleep(5000);
        
        }return new Product(id, "Laptop", 79990);
    }

    @GetMapping("/admin-info")
    public String admin() {
        return "ADMIN-only product information";
    }

    record Product(Long id, String name, double price) {
    }
}
