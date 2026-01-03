package com.example.todo.auth;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
  private final AuthService service;
  @PostMapping("/register") public ResponseEntity<Void> register(@Valid @RequestBody AuthDtos.RegisterRequest r){ service.register(r.username(),r.password()); return ResponseEntity.status(HttpStatus.CREATED).build(); }
  @PostMapping("/login") public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.AuthRequest r){ return service.login(r.username(),r.password()); }
  @PostMapping("/refresh") public AuthDtos.AuthResponse refresh(@RequestParam String token){ return service.refresh(token); }
  @PostMapping("/logout") public ResponseEntity<Void> logout(@RequestParam String token){ service.logout(token); return ResponseEntity.noContent().build(); }
}
