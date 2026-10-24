package com.interviewgym.common;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class)
 ResponseEntity<?> validation(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("message","Please check the submitted fields."));}
 @ExceptionHandler(Exception.class)
 ResponseEntity<?> generic(Exception e){return ResponseEntity.status(500).body(Map.of("message","Unexpected server error."));}
}
