package com.prem.order;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository repository;
    private final UserClient userClient;
    private final ProductClient productClient;

    public OrderController(
            OrderRepository repository,
            UserClient userClient,
            ProductClient productClient) {
        this.repository = repository;
        this.userClient = userClient;
        this.productClient = productClient;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order create(@RequestBody OrderRequest request) {

        if (request.quantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        // Service-to-service call #1
        userClient.findById(request.userId());

        // Service-to-service call #2
        RemoteProduct product = productClient.findById(request.productId());

        if (product.stock() < request.quantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        double total = product.price() * request.quantity();

        // Reduce stock
        productClient.updateStock(
                request.productId(),
                -request.quantity()
        );

        Order order = new Order(
                null,
                request.userId(),
                request.productId(),
                request.quantity(),
                total,
                "CREATED"
        );

        return repository.save(order);
    }

    @GetMapping
    public List<Order> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Order findById(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @GetMapping("/user/{userId}")
    public List<Order> findByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }
}
