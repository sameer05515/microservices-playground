package com.prem.order;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("orders")
public record Order(
        @Id String id,
        String userId,
        String productId,
        int quantity,
        double totalPrice,
        String status
) {}
