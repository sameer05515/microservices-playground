package com.example.todo.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class ObservabilityMetrics {
    private final Counter cacheHits;
    private final Counter cacheMisses;
    private final Counter lockContentions;
    private final Counter rateLimited;

    public ObservabilityMetrics(MeterRegistry registry) {
        cacheHits = Counter.builder("todo.cache.hits").description("Todo cache hits").register(registry);
        cacheMisses = Counter.builder("todo.cache.misses").description("Todo cache misses").register(registry);
        lockContentions = Counter.builder("todo.lock.contentions").description("Redis lock contentions").register(registry);
        rateLimited = Counter.builder("todo.rate_limit.rejected").description("Rate limited requests").register(registry);
    }
    public void cacheHit(){cacheHits.increment();}
    public void cacheMiss(){cacheMisses.increment();}
    public void lockContention(){lockContentions.increment();}
    public void rateLimited(){rateLimited.increment();}
}
