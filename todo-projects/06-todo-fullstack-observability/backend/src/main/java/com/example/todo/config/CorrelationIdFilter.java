package com.example.todo.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class CorrelationIdFilter extends OncePerRequestFilter {
    public static final String CORRELATION_ID = "X-Correlation-ID";
    public static final String REQUEST_ID = "X-Request-ID";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String correlationId = sanitize(request.getHeader(CORRELATION_ID));
        if (correlationId == null) correlationId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        try (MDC.MDCCloseable c = MDC.putCloseable("correlationId", correlationId);
             MDC.MDCCloseable r = MDC.putCloseable("requestId", requestId)) {
            response.setHeader(CORRELATION_ID, correlationId);
            response.setHeader(REQUEST_ID, requestId);
            chain.doFilter(request, response);
        }
    }

    private String sanitize(String value) {
        if (value == null || value.isBlank() || value.length() > 100) return null;
        return value.replaceAll("[^a-zA-Z0-9._:-]", "_");
    }
}
