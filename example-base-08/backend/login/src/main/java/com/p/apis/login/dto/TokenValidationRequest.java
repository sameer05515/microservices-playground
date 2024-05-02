package com.p.apis.login.dto;

import lombok.Data;

@Data
public class TokenValidationRequest {
    private String token;
    private String username;
}