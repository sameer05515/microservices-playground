package com.p.singleton.pattern;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive thread-safety tests for all Singleton implementations
 */
@DisplayName("Thread-Safety Tests for Singleton Patterns")
class SingletonThreadSafetyTest {

    private static final int THREAD_COUNT = 100;
    private static final int ITERATIONS_PER_THREAD = 100;

    @Test
    @DisplayName("Enum Singleton - Thread Safety Test")
    void testEnumSingletonThreadSafety() throws InterruptedException {
        Set<Integer> hashCodes = ConcurrentHashMap.newKeySet();
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);

        IntStream.range(0, THREAD_COUNT).forEach(i -> 
            executor.submit(() -> {
                try {
                    for (int j = 0; j < ITERATIONS_PER_THREAD; j++) {
                        EnumSingleton instance = EnumSingleton.INSTANCE;
                        hashCodes.add(instance.hashCode());
                    }
                } finally {
                    latch.countDown();
                }
            })
        );

        latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        // All instances should have the same hash code (same object)
        assertEquals(1, hashCodes.size(), "Enum Singleton should create only one instance");
    }

    @Test
    @DisplayName("Double-Check Locking Singleton - Thread Safety Test")
    void testDoubleCheckLockingSingletonThreadSafety() throws InterruptedException {
        Set<Integer> hashCodes = ConcurrentHashMap.newKeySet();
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);

        IntStream.range(0, THREAD_COUNT).forEach(i -> 
            executor.submit(() -> {
                try {
                    for (int j = 0; j < ITERATIONS_PER_THREAD; j++) {
                        DoubleCheckLockingSingleton instance = DoubleCheckLockingSingleton.getInstance();
                        hashCodes.add(instance.hashCode());
                    }
                } finally {
                    latch.countDown();
                }
            })
        );

        latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(1, hashCodes.size(), "Double-Check Locking Singleton should create only one instance");
    }

    @Test
    @DisplayName("Bill Pugh Singleton - Thread Safety Test")
    void testBillPughSingletonThreadSafety() throws InterruptedException {
        Set<Integer> hashCodes = ConcurrentHashMap.newKeySet();
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);

        IntStream.range(0, THREAD_COUNT).forEach(i -> 
            executor.submit(() -> {
                try {
                    for (int j = 0; j < ITERATIONS_PER_THREAD; j++) {
                        BillPughSingleton instance = BillPughSingleton.getInstance();
                        hashCodes.add(instance.hashCode());
                    }
                } finally {
                    latch.countDown();
                }
            })
        );

        latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(1, hashCodes.size(), "Bill Pugh Singleton should create only one instance");
    }

    @Test
    @DisplayName("Java 8 Supplier Singleton - Thread Safety Test")
    void testJava8SupplierSingletonThreadSafety() throws InterruptedException {
        Set<Integer> hashCodes = ConcurrentHashMap.newKeySet();
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);

        IntStream.range(0, THREAD_COUNT).forEach(i -> 
            executor.submit(() -> {
                try {
                    for (int j = 0; j < ITERATIONS_PER_THREAD; j++) {
                        Java8SupplierSingleton instance = Java8SupplierSingleton.getInstance();
                        hashCodes.add(instance.hashCode());
                    }
                } finally {
                    latch.countDown();
                }
            })
        );

        latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(1, hashCodes.size(), "Java 8 Supplier Singleton should create only one instance");
    }

    @Test
    @DisplayName("Synchronized Singleton - Thread Safety Test")
    void testSynchronizedSingletonThreadSafety() throws InterruptedException {
        Set<Integer> hashCodes = ConcurrentHashMap.newKeySet();
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);

        IntStream.range(0, THREAD_COUNT).forEach(i -> 
            executor.submit(() -> {
                try {
                    for (int j = 0; j < ITERATIONS_PER_THREAD; j++) {
                        SynchronizedSingleton instance = SynchronizedSingleton.getInstance();
                        hashCodes.add(instance.hashCode());
                    }
                } finally {
                    latch.countDown();
                }
            })
        );

        latch.await(30, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(1, hashCodes.size(), "Synchronized Singleton should create only one instance");
    }

    @Test
    @DisplayName("Enum Singleton - Instance Consistency Test")
    void testEnumSingletonInstanceConsistency() {
        EnumSingleton instance1 = EnumSingleton.INSTANCE;
        EnumSingleton instance2 = EnumSingleton.INSTANCE;
        
        assertSame(instance1, instance2, "Enum Singleton should return the same instance");
        assertEquals(instance1.hashCode(), instance2.hashCode());
    }

    @Test
    @DisplayName("Double-Check Locking Singleton - Instance Consistency Test")
    void testDoubleCheckLockingSingletonInstanceConsistency() {
        DoubleCheckLockingSingleton instance1 = DoubleCheckLockingSingleton.getInstance();
        DoubleCheckLockingSingleton instance2 = DoubleCheckLockingSingleton.getInstance();
        
        assertSame(instance1, instance2, "Double-Check Locking Singleton should return the same instance");
        assertEquals(instance1.hashCode(), instance2.hashCode());
    }

    @Test
    @DisplayName("Bill Pugh Singleton - Instance Consistency Test")
    void testBillPughSingletonInstanceConsistency() {
        BillPughSingleton instance1 = BillPughSingleton.getInstance();
        BillPughSingleton instance2 = BillPughSingleton.getInstance();
        
        assertSame(instance1, instance2, "Bill Pugh Singleton should return the same instance");
        assertEquals(instance1.hashCode(), instance2.hashCode());
    }
}

