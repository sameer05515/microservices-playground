package com.prem.order;

public record OrderRequest(
        String userId,
        String productId,
        int quantity
) {}
