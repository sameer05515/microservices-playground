package com.example.auth;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;
@Service @RequiredArgsConstructor
public class AuthService {
  private final UserRepository users; private final RefreshTokenRepository refreshTokens;
  private final PasswordEncoder encoder; private final AuthenticationManager authManager; private final JwtService jwt;
  @Transactional public void register(String username,String password){
    if(users.existsByUsername(username)) throw new IllegalArgumentException("Username already exists");
    users.save(User.builder().username(username).password(encoder.encode(password)).role(Role.USER).build());
  }
  @Transactional public AuthDtos.AuthResponse login(String username,String password){
    authManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
    return issue(users.findByUsername(username).orElseThrow());
  }
  @Transactional public AuthDtos.AuthResponse refresh(String raw){
    RefreshToken rt=refreshTokens.findByToken(raw).orElseThrow(()->new BadCredentialsException("Invalid refresh token"));
    if(rt.getRevokedAt()!=null || rt.getExpiresAt().isBefore(Instant.now()))
      throw new BadCredentialsException("Refresh token expired or revoked");
    rt.setRevokedAt(Instant.now());
    return issue(rt.getUser());
  }
  @Transactional public void logout(String raw){ refreshTokens.findByToken(raw).ifPresent(t->t.setRevokedAt(Instant.now())); }
  private AuthDtos.AuthResponse issue(User u){
    String refresh=UUID.randomUUID()+"."+UUID.randomUUID();
    refreshTokens.save(RefreshToken.builder().token(refresh).user(u)
      .expiresAt(Instant.now().plusSeconds(7*24*3600)).build());
    return new AuthDtos.AuthResponse(jwt.generate(u),refresh);
  }
}
