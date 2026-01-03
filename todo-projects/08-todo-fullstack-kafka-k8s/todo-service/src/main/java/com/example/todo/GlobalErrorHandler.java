package com.example.todo;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
@RestControllerAdvice
public class GlobalErrorHandler{
 @ExceptionHandler(Exception.class) ResponseEntity<?> error(Exception e){
   return ResponseEntity.status(500).body(Map.of("timestamp",Instant.now(),"status",500,"message","Internal server error"));
 }
}
