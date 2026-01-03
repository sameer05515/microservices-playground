package com.example.todo.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final StringRedisTemplate redis;
    private final int limit;
    private final ObservabilityMetrics metrics;
    public RateLimitFilter(StringRedisTemplate redis, @Value("${app.redis.rate-limit-per-minute:120}") int limit, ObservabilityMetrics metrics) { this.redis=redis; this.limit=limit; this.metrics=metrics; }
    @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws ServletException,IOException {
        String key="rate:"+req.getRemoteAddr()+":"+(System.currentTimeMillis()/60000);
        Long count=redis.opsForValue().increment(key);
        if(count!=null && count==1) redis.expire(key, Duration.ofSeconds(65));
        if(count!=null && count>limit){ metrics.rateLimited(); res.setStatus(429); res.setContentType("application/json"); res.setHeader("Retry-After","60"); res.getWriter().write("{\"status\":429,\"message\":\"Too many requests\"}"); return; }
        chain.doFilter(req,res);
    }
}
