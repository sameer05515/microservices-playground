package com.example.auth;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
@Service
public class JwtService {
  private final SecretKey key; private final long expirationMs;
  public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-ms}") long expirationMs){
    key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expirationMs=expirationMs;
  }
  public String generate(User u){
    Instant now=Instant.now();
    return Jwts.builder().subject(u.getUsername()).claim("role",u.getRole().name())
      .issuedAt(Date.from(now)).expiration(new Date(System.currentTimeMillis()+expirationMs))
      .signWith(key).compact();
  }
}
