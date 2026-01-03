package com.prem.order;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final ProductClient productClient;

    public OrderController(ProductClient productClient) {
        this.productClient = productClient;
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable Long orderId,
                                  @RequestParam(defaultValue = "1") Long productId) {
        ProductClient.Product product = productClient.getProduct(productId);

        return new OrderResponse(
                orderId,
                product.id(),
                product.name(),
                product.price(),
                product.name().startsWith("Fallback")
        );
    }

    record OrderResponse(
            Long orderId,
            Long productId,
            String productName,
            double price,
            boolean fallback
    ) {}
}
