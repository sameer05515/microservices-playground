package com.p.parctice.order.base.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

/**
 * A utility class to create standardized API responses for success and error scenarios.
 */
public class ResponseMapper {

    /**
     * Creates a success response.
     *
     * @param data   The data to be included in the response.
     * @param status The HTTP status.
     * @param <T>    The type of the data being returned.
     * @return A ResponseEntity containing the standardized success response.
     */
    public static <T> ResponseEntity<StandardResponse<T>> createSuccessResponse(T data, HttpStatus status) {
        return buildResponse("success", "Request was successful", data, status);
    }

    /**
     * Creates a success response with a custom message.
     *
     * @param message The success message.
     * @param data    The data to be included in the response.
     * @param status  The HTTP status.
     * @param <T>     The type of the data being returned.
     * @return A ResponseEntity containing the standardized success response.
     */
    public static <T> ResponseEntity<StandardResponse<T>> createSuccessResponse(String message, T data, HttpStatus status) {
        return buildResponse("success", "Request was successful: " + message, data, status);
    }

    /**
     * Creates an error response.
     *
     * @param message The error message.
     * @param status  The HTTP status.
     * @param <T>     The type of the data being returned (usually null for errors).
     * @return A ResponseEntity containing the standardized error response.
     */
    public static <T> ResponseEntity<StandardResponse<T>> createErrorResponse(String message, HttpStatus status) {
        return buildResponse("error", message, null, status);
    }

    /**
     * Creates an error response with exception details.
     *
     * @param message   The error message.
     * @param status    The HTTP status.
     * @param exception The exception object.
     * @param <T>       The type of the data being returned (usually null for errors).
     * @return A ResponseEntity containing the standardized error response with exception details.
     */
    public static <T> ResponseEntity<StandardResponse<T>> createErrorResponse(String message, HttpStatus status, Exception exception) {
        return buildResponse("error", message + ": " + exception.getMessage(), null, status);
    }

    /**
     * Builds a standardized response.
     *
     * @param status  The status of the response ("success" or "error").
     * @param message The message to be included in the response.
     * @param data    The data to be included in the response.
     * @param status  The HTTP status.
     * @param <T>     The type of the data being returned.
     * @return A ResponseEntity containing the standardized response.
     */
    private static <T> ResponseEntity<StandardResponse<T>> buildResponse(String status, String message, T data, HttpStatus httpStatus) {
        StandardResponse<T> response = StandardResponse.<T>builder()
                .status(status)
                .message(message)
                .data(data)
                .statusCode(httpStatus.value())
                .timeStamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, httpStatus);
    }
}
