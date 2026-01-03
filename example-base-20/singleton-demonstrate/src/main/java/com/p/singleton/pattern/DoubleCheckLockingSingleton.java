package com.p.singleton.pattern;

/**
 * Double-Check Locking Singleton Pattern with volatile keyword
 * 
 * This pattern uses double-check locking to reduce the overhead of synchronization.
 * The volatile keyword ensures visibility of changes to variables across threads.
 * 
 * Java 8 Feature: Works perfectly with Java 8's memory model improvements
 * 
 * Advantages:
 * - Lazy initialization (instance created only when needed)
 * - Thread-safe with minimal synchronization overhead
 * - Performance optimized (synchronization only on first access)
 * 
 * Note: In Java 5+, volatile provides proper memory visibility guarantees
 */
public class DoubleCheckLockingSingleton {
    
    // volatile ensures that the instance variable is read from/written to main memory
    // This prevents thread-local caching and ensures visibility across threads
    private static volatile DoubleCheckLockingSingleton instance;
    
    private int value;
    private String data;

    // Private constructor to prevent instantiation
    private DoubleCheckLockingSingleton() {
        // Prevent instantiation via reflection
        if (instance != null) {
            throw new IllegalStateException("Singleton instance already exists. Use getInstance() method.");
        }
        this.value = 0;
        this.data = "Default";
    }

    /**
     * Thread-safe getInstance method using double-check locking
     * 
     * @return the singleton instance
     */
    public static DoubleCheckLockingSingleton getInstance() {
        // First check (without locking) - improves performance
        if (instance == null) {
            // Synchronize only when instance is null
            synchronized (DoubleCheckLockingSingleton.class) {
                // Second check (with locking) - ensures only one instance is created
                if (instance == null) {
                    instance = new DoubleCheckLockingSingleton();
                }
            }
        }
        return instance;
    }

    public void doSomething() {
        System.out.println("DoubleCheckLockingSingleton instance: " + instance.hashCode());
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

