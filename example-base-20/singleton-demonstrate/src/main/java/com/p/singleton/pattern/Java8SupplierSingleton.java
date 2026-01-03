package com.p.singleton.pattern;

import java.util.function.Supplier;

/**
 * Java 8 Supplier-based Singleton Pattern
 * 
 * This pattern leverages Java 8's functional programming features,
 * specifically the Supplier functional interface, to implement a singleton.
 * 
 * Java 8 Features Used:
 * - Supplier<T> functional interface
 * - Method references
 * - Lambda expressions (optional)
 * 
 * Advantages:
 * - Uses modern Java 8 features
 * - Flexible and testable
 * - Can be easily mocked in tests
 * - Thread-safe when used with synchronized or concurrent patterns
 */
public class Java8SupplierSingleton {
    
    private int value;
    private String data;

    // Private constructor
    private Java8SupplierSingleton() {
        this.value = 0;
        this.data = "Default";
    }

    // Supplier that provides the singleton instance
    // Using synchronized to ensure thread-safety
    private static final Supplier<Java8SupplierSingleton> INSTANCE_SUPPLIER = 
        new Supplier<Java8SupplierSingleton>() {
            private volatile Java8SupplierSingleton instance;

            @Override
            public Java8SupplierSingleton get() {
                if (instance == null) {
                    synchronized (this) {
                        if (instance == null) {
                            instance = new Java8SupplierSingleton();
                        }
                    }
                }
                return instance;
            }
        };

    /**
     * Get the singleton instance using the Supplier
     * 
     * @return the singleton instance
     */
    public static Java8SupplierSingleton getInstance() {
        return INSTANCE_SUPPLIER.get();
    }

    public void doSomething() {
        System.out.println("Java8SupplierSingleton instance: " + getInstance().hashCode());
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

