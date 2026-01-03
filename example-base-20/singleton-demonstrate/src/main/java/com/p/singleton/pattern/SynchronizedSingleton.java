package com.p.singleton.pattern;

/**
 * Synchronized Singleton Pattern (Thread-Safe but with performance overhead)
 * 
 * This is the simplest thread-safe singleton implementation using synchronized.
 * However, it has performance overhead because every access is synchronized.
 * 
 * Java 8 Feature: Works with Java 8, though not optimal for high-performance scenarios
 * 
 * Advantages:
 * - Simple and easy to understand
 * - Thread-safe
 * - Lazy initialization
 * 
 * Disadvantages:
 * - Performance overhead (synchronization on every access)
 * - Not recommended for high-performance applications
 */
public class SynchronizedSingleton {
    
    private static SynchronizedSingleton instance;
    private int value;
    private String data;

    // Private constructor
    private SynchronizedSingleton() {
        this.value = 0;
        this.data = "Default";
    }

    /**
     * Thread-safe getInstance method using synchronized
     * 
     * Note: Synchronizing the entire method ensures thread-safety but reduces performance
     * 
     * @return the singleton instance
     */
    public static synchronized SynchronizedSingleton getInstance() {
        if (instance == null) {
            instance = new SynchronizedSingleton();
        }
        return instance;
    }

    public void doSomething() {
        System.out.println("SynchronizedSingleton instance: " + instance.hashCode());
        System.out.println("Value: " + value + ", Data: " + data);
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}

