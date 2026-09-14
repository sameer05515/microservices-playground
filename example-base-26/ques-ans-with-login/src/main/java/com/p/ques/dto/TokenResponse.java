package com.p.ques.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {
}