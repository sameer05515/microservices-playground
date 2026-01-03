package com.prem.order;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final ProductClient c;

    public OrderController(ProductClient c) {
        this.c = c;
    }

    @GetMapping("/{id}")
    public Mono<OrderResponse> get(@PathVariable Long id, @RequestParam(defaultValue = "1") Long productId) {
        return c.getProduct(productId).map(p -> new OrderResponse(id, p.id(), p.name(), p.price(), p.name().startsWith("Fallback")));
    }

    @GetMapping("/admin/report")
    public String report() {
        return "ADMIN-only order report";
    }

    record OrderResponse(Long orderId, Long productId, String productName, double price, boolean fallback) {
    }
}
