package com.prem.user;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserNotFound(UserNotFoundException ex, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), 404, "USER_NOT_FOUND", ex.getMessage(), request.getRequestURI());
    }
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequest(IllegalArgumentException ex, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), 400, "BAD_REQUEST", ex.getMessage(), request.getRequestURI());
    }
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneric(Exception ex, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), 500, "INTERNAL_SERVER_ERROR", "Unexpected error occurred", request.getRequestURI());
    }
}
