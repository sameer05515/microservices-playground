package com.p.parctice.order.service;

import com.p.parctice.order.entity.Order;
import com.p.parctice.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductServiceClient productServiceClient;

    public OrderService(OrderRepository orderRepository, ProductServiceClient productServiceClient) {
        this.orderRepository = orderRepository;
        this.productServiceClient = productServiceClient;
    }

    public Order createOrder(Order order) {
        order.getProductIds().forEach(productId -> {
            try {
                productServiceClient.getProductById(productId);
            } catch (Exception e) {
                throw new RuntimeException("Failed to retrieve product with ID: " + productId);
            }
        });
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}

