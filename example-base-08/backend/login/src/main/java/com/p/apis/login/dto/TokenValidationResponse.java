package com.p.apis.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TokenValidationResponse {
    private boolean valid;
}