package com.example.todo.config;
import jakarta.validation.ConstraintViolationException; import org.springframework.dao.DataIntegrityViolationException; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiError> bad(IllegalArgumentException e){return ResponseEntity.badRequest().body(error(400,e.getMessage()));}
 @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class) ResponseEntity<ApiError> auth(Exception e){return ResponseEntity.status(401).body(error(401,"Invalid credentials or token"));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> validation(MethodArgumentNotValidException e){Map<String,String> m=new LinkedHashMap<>();e.getBindingResult().getFieldErrors().forEach(x->m.put(x.getField(),x.getDefaultMessage()));return ResponseEntity.badRequest().body(new ApiError(Instant.now(),400,"Validation failed",m));}
 @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<ApiError> conflict(){return ResponseEntity.status(409).body(error(409,"Resource conflict"));}
 @ExceptionHandler(ConstraintViolationException.class) ResponseEntity<ApiError> constraint(){return ResponseEntity.badRequest().body(error(400,"Invalid request"));}
 @ExceptionHandler(org.springframework.orm.ObjectOptimisticLockingFailureException.class) ResponseEntity<ApiError> optimistic(){return ResponseEntity.status(409).body(error(409,"Todo was modified by another request. Please reload and try again."));}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> other(Exception e){return ResponseEntity.status(500).body(error(500,"Internal server error"));}
 private ApiError error(int s,String m){return new ApiError(Instant.now(),s,m,Map.of());}
 public record ApiError(Instant timestamp,int status,String message,Map<String,String> fieldErrors){}
}
