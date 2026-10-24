package com.interviewgym.security;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;
@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain filterChain(HttpSecurity http,JwtAuthFilter jwt) throws Exception {
   return http.csrf(c->c.disable()).cors(Customizer.withDefaults())
    .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/error").permitAll().anyRequest().authenticated())
    .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class).build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource(){
   CorsConfiguration c=new CorsConfiguration(); c.setAllowedOrigins(List.of("http://localhost:5173","http://127.0.0.1:5173"));
   c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); c.setAllowedHeaders(List.of("Authorization","Content-Type"));
   UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**",c); return s;
 }
}
