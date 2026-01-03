package com.p.singleton.controller;

import com.p.singleton.pattern.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * REST Controller to demonstrate various Singleton pattern implementations
 */
@RestController
@RequestMapping("/api/singleton")
public class SingletonDemoController {

    /**
     * Demonstrate Enum Singleton
     */
    @GetMapping("/enum")
    public ResponseEntity<Map<String, Object>> demonstrateEnumSingleton(
            @RequestParam(required = false) Integer value,
            @RequestParam(required = false) String data) {
        
        EnumSingleton singleton = EnumSingleton.INSTANCE;
        
        if (value != null && data != null) {
            singleton.initialize(value, data);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("instanceHashCode", singleton.hashCode());
        response.put("value", singleton.getValue());
        response.put("data", singleton.getData());
        response.put("pattern", "Enum Singleton (Recommended)");
        response.put("description", "Thread-safe by default, serialization-safe, reflection-safe");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Demonstrate Double-Check Locking Singleton
     */
    @GetMapping("/double-check")
    public ResponseEntity<Map<String, Object>> demonstrateDoubleCheckSingleton(
            @RequestParam(required = false) Integer value,
            @RequestParam(required = false) String data) {
        
        DoubleCheckLockingSingleton singleton = DoubleCheckLockingSingleton.getInstance();
        
        if (value != null) singleton.setValue(value);
        if (data != null) singleton.setData(data);
        
        Map<String, Object> response = new HashMap<>();
        response.put("instanceHashCode", singleton.hashCode());
        response.put("value", singleton.getValue());
        response.put("data", singleton.getData());
        response.put("pattern", "Double-Check Locking Singleton");
        response.put("description", "Lazy initialization with minimal synchronization overhead");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Demonstrate Bill Pugh (Initialization-on-Demand Holder) Singleton
     */
    @GetMapping("/bill-pugh")
    public ResponseEntity<Map<String, Object>> demonstrateBillPughSingleton(
            @RequestParam(required = false) Integer value,
            @RequestParam(required = false) String data) {
        
        BillPughSingleton singleton = BillPughSingleton.getInstance();
        
        if (value != null) singleton.setValue(value);
        if (data != null) singleton.setData(data);
        
        Map<String, Object> response = new HashMap<>();
        response.put("instanceHashCode", singleton.hashCode());
        response.put("value", singleton.getValue());
        response.put("data", singleton.getData());
        response.put("pattern", "Bill Pugh Singleton (Initialization-on-Demand Holder)");
        response.put("description", "Thread-safe lazy initialization without synchronization overhead");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Demonstrate Java 8 Supplier Singleton
     */
    @GetMapping("/java8-supplier")
    public ResponseEntity<Map<String, Object>> demonstrateJava8SupplierSingleton(
            @RequestParam(required = false) Integer value,
            @RequestParam(required = false) String data) {
        
        Java8SupplierSingleton singleton = Java8SupplierSingleton.getInstance();
        
        if (value != null) singleton.setValue(value);
        if (data != null) singleton.setData(data);
        
        Map<String, Object> response = new HashMap<>();
        response.put("instanceHashCode", singleton.hashCode());
        response.put("value", singleton.getValue());
        response.put("data", singleton.getData());
        response.put("pattern", "Java 8 Supplier Singleton");
        response.put("description", "Uses Java 8 Supplier functional interface");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Demonstrate Synchronized Singleton
     */
    @GetMapping("/synchronized")
    public ResponseEntity<Map<String, Object>> demonstrateSynchronizedSingleton(
            @RequestParam(required = false) Integer value,
            @RequestParam(required = false) String data) {
        
        SynchronizedSingleton singleton = SynchronizedSingleton.getInstance();
        
        if (value != null) singleton.setValue(value);
        if (data != null) singleton.setData(data);
        
        Map<String, Object> response = new HashMap<>();
        response.put("instanceHashCode", singleton.hashCode());
        response.put("value", singleton.getValue());
        response.put("data", singleton.getData());
        response.put("pattern", "Synchronized Singleton");
        response.put("description", "Simple thread-safe implementation with performance overhead");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Compare all singleton implementations - verify they return the same instance on multiple calls
     */
    @GetMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareSingletons() {
        Map<String, Object> response = new ConcurrentHashMap<>();
        
        // Get instances multiple times to verify they are the same
        EnumSingleton enum1 = EnumSingleton.INSTANCE;
        EnumSingleton enum2 = EnumSingleton.INSTANCE;
        
        DoubleCheckLockingSingleton dcl1 = DoubleCheckLockingSingleton.getInstance();
        DoubleCheckLockingSingleton dcl2 = DoubleCheckLockingSingleton.getInstance();
        
        BillPughSingleton bp1 = BillPughSingleton.getInstance();
        BillPughSingleton bp2 = BillPughSingleton.getInstance();
        
        Java8SupplierSingleton j81 = Java8SupplierSingleton.getInstance();
        Java8SupplierSingleton j82 = Java8SupplierSingleton.getInstance();
        
        SynchronizedSingleton sync1 = SynchronizedSingleton.getInstance();
        SynchronizedSingleton sync2 = SynchronizedSingleton.getInstance();
        
        response.put("enumSingleton", Map.of(
            "firstCall", enum1.hashCode(),
            "secondCall", enum2.hashCode(),
            "sameInstance", enum1 == enum2
        ));
        
        response.put("doubleCheckLocking", Map.of(
            "firstCall", dcl1.hashCode(),
            "secondCall", dcl2.hashCode(),
            "sameInstance", dcl1 == dcl2
        ));
        
        response.put("billPugh", Map.of(
            "firstCall", bp1.hashCode(),
            "secondCall", bp2.hashCode(),
            "sameInstance", bp1 == bp2
        ));
        
        response.put("java8Supplier", Map.of(
            "firstCall", j81.hashCode(),
            "secondCall", j82.hashCode(),
            "sameInstance", j81 == j82
        ));
        
        response.put("synchronized", Map.of(
            "firstCall", sync1.hashCode(),
            "secondCall", sync2.hashCode(),
            "sameInstance", sync1 == sync2
        ));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get information about all singleton patterns
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getSingletonInfo() {
        Map<String, Object> info = new HashMap<>();
        
        info.put("patterns", Map.of(
            "enum", Map.of(
                "name", "Enum Singleton",
                "recommended", true,
                "threadSafe", true,
                "lazyInitialization", false,
                "performance", "Excellent",
                "java8Features", "Enum with methods and fields"
            ),
            "doubleCheckLocking", Map.of(
                "name", "Double-Check Locking",
                "recommended", true,
                "threadSafe", true,
                "lazyInitialization", true,
                "performance", "Good",
                "java8Features", "volatile keyword with improved memory model"
            ),
            "billPugh", Map.of(
                "name", "Bill Pugh (Initialization-on-Demand Holder)",
                "recommended", true,
                "threadSafe", true,
                "lazyInitialization", true,
                "performance", "Excellent",
                "java8Features", "Class loading mechanism"
            ),
            "java8Supplier", Map.of(
                "name", "Java 8 Supplier",
                "recommended", false,
                "threadSafe", true,
                "lazyInitialization", true,
                "performance", "Good",
                "java8Features", "Supplier<T> functional interface"
            ),
            "synchronized", Map.of(
                "name", "Synchronized Singleton",
                "recommended", false,
                "threadSafe", true,
                "lazyInitialization", true,
                "performance", "Fair (synchronization overhead)",
                "java8Features", "Standard synchronized keyword"
            )
        ));
        
        return ResponseEntity.ok(info);
    }
}

