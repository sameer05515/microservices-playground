package com.prem.duplicatefinder.controller;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class)
 @ResponseStatus(HttpStatus.BAD_REQUEST)
 Map<String,String> bad(IllegalArgumentException e){return Map.of("error",e.getMessage());}
 @ExceptionHandler(Exception.class)
 @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
 Map<String,String> err(Exception e){return Map.of("error",e.getMessage()==null?"Unexpected error":e.getMessage());}
}
