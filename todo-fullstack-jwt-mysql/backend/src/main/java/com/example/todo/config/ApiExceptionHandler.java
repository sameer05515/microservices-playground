package com.example.todo.config;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<?> bad(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("timestamp",Instant.now(),"message",e.getMessage()));}
 @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class) ResponseEntity<?> auth(Exception e){return ResponseEntity.status(401).body(Map.of("timestamp",Instant.now(),"message",e.getMessage()));}
 @ExceptionHandler(Exception.class) ResponseEntity<?> other(Exception e){return ResponseEntity.status(500).body(Map.of("timestamp",Instant.now(),"message","Internal server error"));}
}
