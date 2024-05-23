package com.p.parctice.order.controller;

import com.p.parctice.order.base.response.ResponseMapper;
import com.p.parctice.order.base.response.StandardResponse;
import com.p.parctice.order.entity.Order;
import com.p.parctice.order.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<StandardResponse<Order>> createOrder(@RequestBody Order order) {
//        return ResponseEntity.ok(orderService.createOrder(order));
        return ResponseMapper.createSuccessResponse(orderService.createOrder(order), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<StandardResponse<List<Order>>> getAllOrders() {
//        return ResponseEntity.ok(orderService.getAllOrders());
        return ResponseMapper.createSuccessResponse(orderService.getAllOrders(), HttpStatus.OK);
    }
}

