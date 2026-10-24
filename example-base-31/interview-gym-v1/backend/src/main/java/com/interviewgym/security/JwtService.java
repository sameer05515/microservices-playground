package com.interviewgym.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
@Service
public class JwtService {
 private final SecretKey key; private final long expirationMinutes;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-minutes:720}") long expirationMinutes) {
   if(secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalArgumentException("JWT_SECRET must be at least 32 bytes");
   this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expirationMinutes=expirationMinutes;
 }
 public String createToken(AppUser user) {
   Instant now=Instant.now();
   return Jwts.builder().subject(user.getEmail()).claim("name",user.getName()).issuedAt(Date.from(now))
     .expiration(Date.from(now.plusSeconds(expirationMinutes*60))).signWith(key).compact();
 }
 public String subject(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject(); }
}
