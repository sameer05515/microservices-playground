package com.p.parctice.order.base.exception;

//import com.p.java.playground.api.base.response.ResponseMapper;
//import com.p.java.playground.api.base.response.StandardResponse;
import com.p.parctice.order.base.response.ResponseMapper;
import com.p.parctice.order.base.response.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * The GlobalExceptionHandler class provides a global exception handling mechanism.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles IllegalArgumentException and returns an appropriate response.
     *
     * @param ex The exception.
     * @return A StandardResponse containing the error message.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<StandardResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {

        return ResponseMapper.createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Generic exception handler for all other exceptions not explicitly handled.
     *
     * @param ex The exception.
     * @return A ResponseEntity containing a standardized error response.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardResponse<Object>> handleGenericException(Exception ex) {

        return ResponseMapper.createErrorResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
}
