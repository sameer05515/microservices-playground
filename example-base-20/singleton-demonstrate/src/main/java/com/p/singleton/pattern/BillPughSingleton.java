package com.p.singleton.pattern;

/**
 * Initialization-on-Demand Holder (Bill Pugh Singleton Pattern)
 * 
 * This pattern uses a static inner class to hold the singleton instance.
 * The JVM guarantees that the inner class is only loaded when it's first accessed,
 * which provides lazy initialization and thread-safety without synchronization overhead.
 * 
 * Java 8 Feature: Leverages Java's class loading mechanism which is thread-safe
 * 
 * Advantages:
 * - Lazy initialization
 * - Thread-safe (class loading is thread-safe in JVM)
 * - No synchronization overhead
 * - Simple and efficient
 * 
 * This is considered one of the best Singleton implementations for Java
 */
public class BillPughSingleton {
    
    private int value;
    private String data;

    // Private constructor to prevent instantiation
    private BillPughSingleton() {
        this.value = 0;
        this.data = "Default";
    }

    /**
     * Static inner class that holds the singleton instance
     * This class is only loaded when getInstance() is called for the first time
     */
    private static class SingletonHelper {
        // JVM ensures this is initialized only once and in a thread-safe manner
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }

    /**
     * Get the singleton instance
     * Thread-safe without explicit synchronization
     * 
     * @return the singleton instance
     */
    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }

    public void doSomething() {
        System.out.println("BillPughSingleton instance: " + getInstance().hashCode());
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

