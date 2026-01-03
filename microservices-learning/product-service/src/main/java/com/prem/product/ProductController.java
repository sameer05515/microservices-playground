package com.prem.product;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody Product product) {
        return repository.save(new Product(null, product.name(), product.price(), product.stock()));
    }

    @GetMapping
    public List<Product> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Product findById(@PathVariable("id") String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    @PutMapping("/{id}/stock")
    public Product updateStock(@PathVariable("id") String id, @RequestParam("quantity") int quantity) {
        Product product = findById(id);
        int newStock = product.stock() + quantity;

        if (newStock < 0) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        return repository.save(
                new Product(product.id(), product.name(), product.price(), newStock)
        );
    }
}
