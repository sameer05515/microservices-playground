# Thread-Safe Singleton Pattern Implementation using Java 8 Features

This Spring Boot project demonstrates various thread-safe Singleton pattern implementations using Java 8 features. It provides practical examples, REST APIs, and comprehensive tests to understand different approaches to implementing the Singleton pattern in a thread-safe manner.

## Table of Contents

- [Overview](#overview)
- [Singleton Patterns Implemented](#singleton-patterns-implemented)
- [Java 8 Features Used](#java-8-features-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Pattern Comparison](#pattern-comparison)
- [Best Practices](#best-practices)

## Overview

The Singleton pattern ensures that a class has only one instance and provides a global point of access to it. In a multi-threaded environment, it's crucial to implement this pattern in a thread-safe manner to prevent race conditions and ensure consistency.

This project demonstrates five different thread-safe Singleton implementations, each with its own advantages and use cases.

## Singleton Patterns Implemented

### 1. Enum Singleton (Recommended) ⭐
**Location**: `com.p.singleton.pattern.EnumSingleton`

**Features**:
- Thread-safe by default (JVM guarantees enum instance creation)
- Serialization-safe
- Reflection-safe
- Simple and concise

**Java 8 Feature**: Enum can contain methods and fields, making it a powerful singleton implementation

**Example**:
```java
EnumSingleton.INSTANCE.doSomething();
```

### 2. Double-Check Locking Singleton
**Location**: `com.p.singleton.pattern.DoubleCheckLockingSingleton`

**Features**:
- Lazy initialization
- Thread-safe with minimal synchronization overhead
- Uses `volatile` keyword for memory visibility

**Java 8 Feature**: Works with Java 8's improved memory model and `volatile` guarantees

**Example**:
```java
DoubleCheckLockingSingleton instance = DoubleCheckLockingSingleton.getInstance();
```

### 3. Bill Pugh Singleton (Initialization-on-Demand Holder)
**Location**: `com.p.singleton.pattern.BillPughSingleton`

**Features**:
- Lazy initialization
- Thread-safe without synchronization overhead
- Leverages JVM's class loading mechanism

**Java 8 Feature**: Uses Java's thread-safe class loading mechanism

**Example**:
```java
BillPughSingleton instance = BillPughSingleton.getInstance();
```

### 4. Java 8 Supplier Singleton
**Location**: `com.p.singleton.pattern.Java8SupplierSingleton`

**Features**:
- Uses Java 8's `Supplier<T>` functional interface
- Flexible and testable
- Can be easily mocked in tests

**Java 8 Feature**: `Supplier<T>` functional interface

**Example**:
```java
Java8SupplierSingleton instance = Java8SupplierSingleton.getInstance();
```

### 5. Synchronized Singleton
**Location**: `com.p.singleton.pattern.SynchronizedSingleton`

**Features**:
- Simple and easy to understand
- Thread-safe but with performance overhead
- Synchronization on every access

**Note**: Not recommended for high-performance applications

## Java 8 Features Used

1. **Enum with Methods and Fields**: Enums in Java 8 can contain methods, making them powerful singleton implementations
2. **Improved Memory Model**: Better `volatile` semantics in Java 8+
3. **Functional Interfaces**: `Supplier<T>` for functional programming approach
4. **Class Loading Mechanism**: Leverages JVM's thread-safe class loading

## Project Structure

```
example-base-20/
├── src/
│   ├── main/
│   │   ├── java/com/p/singleton/
│   │   │   ├── SingletonPatternDemoApplication.java
│   │   │   ├── pattern/
│   │   │   │   ├── EnumSingleton.java
│   │   │   │   ├── DoubleCheckLockingSingleton.java
│   │   │   │   ├── BillPughSingleton.java
│   │   │   │   ├── Java8SupplierSingleton.java
│   │   │   │   └── SynchronizedSingleton.java
│   │   │   ├── controller/
│   │   │   │   └── SingletonDemoController.java
│   │   │   └── config/
│   │   │       └── OpenApiConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/singleton/
│           ├── pattern/
│           │   └── SingletonThreadSafetyTest.java
│           └── controller/
│               └── SingletonDemoControllerTest.java
├── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- Spring Boot 3.3.1

### Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd example-base-20
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Using Maven Wrapper (if available)

```bash
./mvnw spring-boot:run
```

## API Endpoints

### Base URL
`http://localhost:8080/api/singleton`

### Available Endpoints

#### 1. Get Enum Singleton Instance
```http
GET /api/singleton/enum
GET /api/singleton/enum?value=10&data=TestData
```

**Response**:
```json
{
  "instanceHashCode": 123456789,
  "value": 10,
  "data": "TestData",
  "pattern": "Enum Singleton (Recommended)",
  "description": "Thread-safe by default, serialization-safe, reflection-safe"
}
```

#### 2. Get Double-Check Locking Singleton Instance
```http
GET /api/singleton/double-check
GET /api/singleton/double-check?value=20&data=DoubleCheck
```

#### 3. Get Bill Pugh Singleton Instance
```http
GET /api/singleton/bill-pugh
GET /api/singleton/bill-pugh?value=30&data=BillPugh
```

#### 4. Get Java 8 Supplier Singleton Instance
```http
GET /api/singleton/java8-supplier
GET /api/singleton/java8-supplier?value=40&data=Supplier
```

#### 5. Get Synchronized Singleton Instance
```http
GET /api/singleton/synchronized
GET /api/singleton/synchronized?value=50&data=Synchronized
```

#### 6. Compare All Singleton Implementations
```http
GET /api/singleton/compare
```

**Response**:
```json
{
  "enumSingleton": {
    "firstCall": 123456789,
    "secondCall": 123456789,
    "sameInstance": true
  },
  "doubleCheckLocking": { ... },
  "billPugh": { ... },
  "java8Supplier": { ... },
  "synchronized": { ... }
}
```

#### 7. Get Singleton Pattern Information
```http
GET /api/singleton/info
```

Returns detailed information about all singleton patterns including recommendations, thread-safety, performance, and Java 8 features.

### API Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Testing

### Run All Tests

```bash
mvn test
```

### Run Specific Test Class

```bash
mvn test -Dtest=SingletonThreadSafetyTest
```

### Thread-Safety Tests

The project includes comprehensive thread-safety tests that:
- Create 100 concurrent threads
- Each thread calls `getInstance()` 100 times
- Verify that only one instance is created across all threads
- Test all five singleton implementations

**Test Classes**:
- `SingletonThreadSafetyTest`: Comprehensive thread-safety verification
- `SingletonDemoControllerTest`: REST API endpoint tests

## Pattern Comparison

| Pattern | Thread-Safe | Lazy Init | Performance | Recommended | Java 8 Feature |
|---------|------------|-----------|-------------|-------------|----------------|
| **Enum** | ✅ | ❌ | Excellent | ⭐⭐⭐⭐⭐ | Enum with methods |
| **Bill Pugh** | ✅ | ✅ | Excellent | ⭐⭐⭐⭐⭐ | Class loading |
| **Double-Check Locking** | ✅ | ✅ | Good | ⭐⭐⭐⭐ | volatile keyword |
| **Java 8 Supplier** | ✅ | ✅ | Good | ⭐⭐⭐ | Supplier<T> |
| **Synchronized** | ✅ | ✅ | Fair | ⭐⭐ | Standard synchronized |

### Recommendations

1. **Use Enum Singleton** when:
   - You don't need lazy initialization
   - You want the simplest and most reliable solution
   - Serialization and reflection safety are important

2. **Use Bill Pugh Singleton** when:
   - You need lazy initialization
   - You want excellent performance
   - You prefer simplicity without synchronization

3. **Use Double-Check Locking** when:
   - You need lazy initialization
   - You're comfortable with the pattern
   - Performance is important but not critical

4. **Avoid Synchronized Singleton** in:
   - High-performance applications
   - Scenarios with frequent access
   - Modern Java applications (better alternatives exist)

## Best Practices

1. **Prefer Enum Singleton**: It's the most reliable and recommended approach by Joshua Bloch in "Effective Java"

2. **Use Bill Pugh for Lazy Initialization**: If you need lazy initialization, Bill Pugh pattern is the best choice

3. **Avoid Synchronized on Method**: Prefer double-check locking or Bill Pugh over synchronized methods for better performance

4. **Consider Spring's @Singleton**: In Spring Boot applications, consider using Spring's singleton scope instead of manual implementation

5. **Thread Safety First**: Always ensure thread-safety in multi-threaded environments

6. **Test Thoroughly**: Use concurrent tests to verify thread-safety, as shown in this project

## Code Examples

### Using Enum Singleton

```java
// Initialize and use
EnumSingleton.INSTANCE.initialize(100, "My Data");
EnumSingleton.INSTANCE.doSomething();

// Access properties
int value = EnumSingleton.INSTANCE.getValue();
String data = EnumSingleton.INSTANCE.getData();
```

### Using Bill Pugh Singleton

```java
BillPughSingleton singleton = BillPughSingleton.getInstance();
singleton.setValue(200);
singleton.setData("Bill Pugh Data");
singleton.doSomething();
```

### Using Double-Check Locking

```java
DoubleCheckLockingSingleton singleton = DoubleCheckLockingSingleton.getInstance();
singleton.setValue(300);
singleton.doSomething();
```

## Thread-Safety Verification

All implementations have been tested with:
- 100 concurrent threads
- 100 iterations per thread
- Total: 10,000 concurrent `getInstance()` calls
- All tests verify that only one instance is created

## References

- [Effective Java by Joshua Bloch](https://www.oracle.com/technetwork/java/effectivejava-136174.html)
- [Java Memory Model](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html)
- [Double-Check Locking Pattern](https://en.wikipedia.org/wiki/Double-checked_locking)
- [Singleton Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/singleton)

## License

This project is for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!

