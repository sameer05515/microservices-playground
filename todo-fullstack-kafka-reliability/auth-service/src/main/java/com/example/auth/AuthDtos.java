package com.example.auth;
import jakarta.validation.constraints.NotBlank;
public final class AuthDtos {
  public record AuthRequest(@NotBlank String username,@NotBlank String password){}
  public record RegisterRequest(@NotBlank String username,@NotBlank String password){}
  public record AuthResponse(String accessToken,String refreshToken){}
}
