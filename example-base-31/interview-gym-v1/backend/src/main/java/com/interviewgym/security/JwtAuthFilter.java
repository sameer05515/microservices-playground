package com.interviewgym.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final AppUserRepository users;
 public JwtAuthFilter(JwtService jwt,AppUserRepository users){this.jwt=jwt;this.users=users;}
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
   String h=request.getHeader("Authorization");
   if(h!=null && h.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication()==null) {
     try { String email=jwt.subject(h.substring(7)); var user=users.findByEmail(email);
       if(user.isPresent()) SecurityContextHolder.getContext().setAuthentication(
         new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority("ROLE_USER"))));
     } catch(Exception ignored) { /* Invalid/expired tokens remain unauthenticated. */ }
   }
   chain.doFilter(request,response);
 }
}
