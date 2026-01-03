package com.iagent.common;
import jakarta.servlet.http.HttpServletRequest; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.time.Instant;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiError> nf(ResourceNotFoundException e,HttpServletRequest r){return build(HttpStatus.NOT_FOUND,e.getMessage(),r);}
 @ExceptionHandler(BadRequestException.class) ResponseEntity<ApiError> br(BadRequestException e,HttpServletRequest r){return build(HttpStatus.BAD_REQUEST,e.getMessage(),r);}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> ex(Exception e,HttpServletRequest r){return build(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(),r);}
 private ResponseEntity<ApiError> build(HttpStatus s,String m,HttpServletRequest r){return ResponseEntity.status(s).body(new ApiError(Instant.now(),s.value(),s.getReasonPhrase(),m,r.getRequestURI()));}
}
