package com.example.todo.auth;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@Component @RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwt; private final CustomUserDetailsService users;
  protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws ServletException,IOException {
    String h=req.getHeader("Authorization");
    if(h!=null && h.startsWith("Bearer ")){
      String token=h.substring(7);
      if(jwt.valid(token) && SecurityContextHolder.getContext().getAuthentication()==null){
        try{
          UserDetails ud=users.loadUserByUsername(jwt.username(token));
          var auth=new UsernamePasswordAuthenticationToken(ud,null,ud.getAuthorities());
          auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
          SecurityContextHolder.getContext().setAuthentication(auth);
        }catch(Exception ignored){}
      }
    }
    chain.doFilter(req,res);
  }
}
