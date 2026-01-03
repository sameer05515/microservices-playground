package com.prem.order;

public record RemoteProduct(
        String id,
        String name,
        double price,
        int stock
) {}
