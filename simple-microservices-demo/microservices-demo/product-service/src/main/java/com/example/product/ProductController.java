package com.example.product;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/products")
public class ProductController {
 private final ProductRepository repo;
 public ProductController(ProductRepository repo){this.repo=repo;}
 @GetMapping public List<Product> all(){return repo.findAll();}
 @PostMapping public Product create(@RequestBody Product p){return repo.save(p);}
}