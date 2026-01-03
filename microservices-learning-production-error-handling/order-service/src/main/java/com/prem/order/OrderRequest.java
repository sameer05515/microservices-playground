package com.prem.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record OrderRequest(
    @NotBlank(message = "userId is required") String userId,
    @NotBlank(message = "productId is required") String productId,
    @Min(value = 1, message = "quantity must be greater than zero") int quantity
) {}
