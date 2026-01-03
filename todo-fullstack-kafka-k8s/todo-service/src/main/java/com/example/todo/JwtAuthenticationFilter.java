package com.example.todo;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
@Component @RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{
 private final SecretKey key;
 public JwtAuthenticationFilter(@Value("${app.jwt.secret}")String secret){key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")){
   try{
    var p=Jwts.parser().verifyWith(key).build().parseSignedClaims(h.substring(7)).getPayload();
    String role=p.get("role",String.class);
    var auth=new UsernamePasswordAuthenticationToken(p.getSubject(),null,
      java.util.List.of(new SimpleGrantedAuthority("ROLE_"+role)));
    SecurityContextHolder.getContext().setAuthentication(auth);
   }catch(JwtException|IllegalArgumentException ignored){}
  }
  chain.doFilter(req,res);
 }
}
