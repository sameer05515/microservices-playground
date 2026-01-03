package com.p.singleton.pattern;

/**
 * Enum-based Singleton Pattern (Recommended Approach)
 * 
 * This is the most thread-safe and recommended way to implement Singleton in Java.
 * Advantages:
 * - Thread-safe by default (enum instances are created by JVM)
 * - Serialization-safe (enums are inherently serializable)
 * - Reflection-safe (cannot create multiple instances via reflection)
 * - Simple and concise
 * 
 * Java 8 Feature: Enum can contain methods and fields, making it a powerful singleton implementation
 */
public enum EnumSingleton {
    INSTANCE;

    private int value;
    private String data;

    // Private constructor is implicit for enums
    // But we can add custom initialization logic

    /**
     * Initialize the singleton instance
     */
    public void initialize(int value, String data) {
        this.value = value;
        this.data = data;
    }

    /**
     * Business method
     */
    public void doSomething() {
        System.out.println("EnumSingleton instance: " + INSTANCE.hashCode());
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

    /**
     * Example usage:
     * EnumSingleton.INSTANCE.doSomething();
     */
}

