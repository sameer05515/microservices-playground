# Builder Pattern for Complex REST API Responses

This Spring Boot project demonstrates the **Builder Pattern** and its advantages when constructing complex objects, particularly REST API responses. It shows how the Builder Pattern solves common problems with traditional object construction methods.

## Table of Contents

- [What is the Builder Pattern?](#what-is-the-builder-pattern)
- [Advantages of Builder Pattern](#advantages-of-builder-pattern)
- [Why Use Builder for REST API Responses?](#why-use-builder-for-rest-api-responses)
- [Project Structure](#project-structure)
- [Implementation Examples](#implementation-examples)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Comparison with Other Approaches](#comparison-with-other-approaches)
- [Best Practices](#best-practices)

## What is the Builder Pattern?

The **Builder Pattern** is a creational design pattern that provides a flexible solution to construct complex objects step by step. It separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

### Key Components:

1. **Builder Interface/Class**: Defines methods to build parts of the object
2. **Concrete Builder**: Implements the building steps
3. **Director (Optional)**: Uses the builder to construct objects
4. **Product**: The complex object being built

## Advantages of Builder Pattern

### 1. **Readability and Clarity** ⭐
Builder pattern produces highly readable code that is self-documenting:

```java
// With Builder - Clear and readable
User user = User.builder()
    .id(1L)
    .username("johndoe")
    .email("john@example.com")
    .firstName("John")
    .lastName("Doe")
    .build();

// Without Builder - Hard to read
User user = new User(1L, "johndoe", "john@example.com", "John", "Doe", 
    null, null, null, null, null, false);
```

### 2. **Handles Optional Parameters Elegantly**
Many REST API responses have numerous optional fields. Builder handles this gracefully:

```java
ApiResponse<User> response = ApiResponse.<User>builder()
    .status("success")
    .statusCode(200)
    .message("User retrieved")
    .data(user)
    // Optional fields can be omitted
    // .pagination(...)
    // .error(...)
    // .links(...)
    .build();
```

### 3. **Immutability**
Builder pattern naturally supports creating immutable objects:

```java
// Object is immutable after build()
ApiResponse<User> response = ApiResponse.<User>builder()
    .status("success")
    .data(user)
    .build();
// response cannot be modified - thread-safe!
```

### 4. **Validation**
You can validate the object during construction:

```java
public ApiResponse<T> build() {
    if (status == null) {
        throw new IllegalStateException("Status is required");
    }
    if (statusCode < 100 || statusCode >= 600) {
        throw new IllegalStateException("Invalid status code");
    }
    return new ApiResponse<>(this);
}
```

### 5. **Fluent API / Method Chaining**
Builder provides a fluent interface that's intuitive to use:

```java
ApiResponse<User> response = FluentApiResponseBuilder.<User>success()
    .withMessage("Users retrieved")
    .withItems(users)
    .withPagination(1, 10, 100)
    .withLink("self", "/api/users", "GET")
    .build();
```

### 6. **Type Safety**
Compile-time type checking prevents errors:

```java
// Type-safe - compiler catches errors
ApiResponse<User> response = ApiResponse.<User>builder()
    .data(user) // Must be User type
    .build();
```

### 7. **Flexibility**
Easy to create variations of the same object:

```java
// Success response
ApiResponse.success(user);

// Error response
ApiResponse.error("Not found", 404);

// Paginated response
FluentApiResponseBuilder.success()
    .withItems(users)
    .withPagination(page, size, total)
    .build();
```

### 8. **IDE Support**
Modern IDEs provide excellent autocomplete for builder methods, making development faster and less error-prone.

## Why Use Builder for REST API Responses?

REST API responses are often complex objects with:
- **Multiple status fields** (status, statusCode, message)
- **Data payload** (single object or list)
- **Metadata** (version, requestId, etc.)
- **Pagination information** (page, size, total)
- **Error details** (message, code, stackTrace)
- **HATEOAS links** (self, next, previous)
- **Timestamps** (createdAt, updatedAt)

### Problems Without Builder:

1. **Constructor Overload**: Too many constructors for different combinations
2. **Setter Hell**: Many setter calls, easy to forget required fields
3. **Not Immutable**: Objects can be modified after creation
4. **No Validation**: Invalid states possible
5. **Poor Readability**: Hard to understand what each parameter means

### Solution with Builder:

```java
// Clean, readable, type-safe, immutable
ApiResponse<User> response = ApiResponse.<User>builder()
    .status("success")
    .statusCode(200)
    .message("User retrieved successfully")
    .data(user)
    .metadata(Map.of("version", "1.0", "requestId", "req-123"))
    .pagination(PaginationInfo.builder()
        .page(1)
        .size(10)
        .totalElements(100)
        .build())
    .links(Arrays.asList(
        Link.builder().rel("self").href("/api/users/1").method("GET").build()
    ))
    .build();
```

## Project Structure

```
builder-pattern-demonstrate/
├── src/
│   ├── main/
│   │   ├── java/com/p/builder/
│   │   │   ├── BuilderPatternApplication.java
│   │   │   ├── model/
│   │   │   │   ├── ApiResponse.java          # Manual Builder
│   │   │   │   ├── PaginationInfo.java       # Lombok @Builder
│   │   │   │   ├── ErrorInfo.java           # Lombok @Builder
│   │   │   │   ├── Link.java                # Lombok @Builder
│   │   │   │   ├── User.java                # Lombok @Builder
│   │   │   │   └── Address.java             # Lombok @Builder
│   │   │   ├── builder/
│   │   │   │   ├── FluentApiResponseBuilder.java  # Fluent Builder
│   │   │   │   └── StepBuilder.java              # Step Builder
│   │   │   ├── controller/
│   │   │   │   ├── BuilderPatternController.java  # Examples
│   │   │   │   └── ComparisonController.java     # Comparisons
│   │   │   └── config/
│   │   │       └── OpenApiConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/builder/
│           ├── model/
│           │   └── ApiResponseTest.java
│           └── builder/
│               └── FluentApiResponseBuilderTest.java
├── pom.xml
└── README.md
```

## Implementation Examples

### 1. Manual Builder Pattern

```java
// ApiResponse with manual builder
ApiResponse<User> response = ApiResponse.<User>builder()
    .status("success")
    .statusCode(200)
    .message("User retrieved")
    .data(user)
    .build();
```

### 2. Lombok @Builder

```java
// Using Lombok @Builder annotation
User user = User.builder()
    .id(1L)
    .username("johndoe")
    .email("john@example.com")
    .address(Address.builder()
        .street("123 Main St")
        .city("New York")
        .build())
    .build();
```

### 3. Fluent Builder

```java
// Fluent API with method chaining
ApiResponse<User> response = FluentApiResponseBuilder.<User>success()
    .withMessage("Users retrieved")
    .withItems(users)
    .withPagination(1, 10, 100)
    .withMetadata("sortBy", "username")
    .withLink("self", "/api/users", "GET")
    .build();
```

### 4. Step Builder

```java
// Step-by-step guided building
ApiResponse<?> response = StepBuilder.newBuilder()
    .success()
    .withDefaultStatus()
    .withDefaultStatusCode()
    .withMessage("User created")
    .withData(user)
    .withMetadata("version", "1.0")
    .build();
```

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.6+
- Spring Boot 3.3.1

### Installation

1. **Navigate to the project**:
   ```bash
   cd example-base-20/builder-pattern-demonstrate
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Base URL
`http://localhost:8080/api`

### Builder Pattern Examples

#### 1. Simple Success Response
```http
GET /api/builder/simple-success
```

#### 2. Complex Response
```http
GET /api/builder/complex-response
```

#### 3. Paginated Response
```http
GET /api/builder/paginated?page=0&size=10
```

#### 4. Error Response
```http
GET /api/builder/error-example
```

#### 5. Step Builder Example
```http
GET /api/builder/step-builder-example
```

#### 6. Nested Complex Object
```http
GET /api/builder/nested-complex
```

#### 7. Conditional Building
```http
GET /api/builder/conditional?includeAddress=true&includeRoles=true
```

### Comparison Endpoints

#### 1. Constructor Approach Problems
```http
GET /api/comparison/constructor-approach
```

#### 2. Setter Approach Problems
```http
GET /api/comparison/setter-approach
```

#### 3. Builder Approach Advantages
```http
GET /api/comparison/builder-approach
```

#### 4. Side-by-Side Comparison
```http
GET /api/comparison/side-by-side
```

### API Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Comparison with Other Approaches

### Constructor Approach

```java
// Problem: Too many parameters, hard to read
User user = new User(1L, "johndoe", "john@example.com", "John", "Doe", 
    null, null, null, null, null, false);
```

**Problems:**
- ❌ Hard to remember parameter order
- ❌ All parameters required (even if null)
- ❌ Not readable
- ❌ Error-prone (easy to swap parameters)

### Setter Approach

```java
// Problem: Not immutable, verbose, can forget required fields
User user = new User();
user.setId(1L);
user.setUsername("johndoe");
user.setEmail("john@example.com");
// ... many more setters
// What if we forget a required field?
```

**Problems:**
- ❌ Not immutable
- ❌ Can forget required fields
- ❌ No validation
- ❌ Verbose code
- ❌ Can be modified after creation

### Builder Approach

```java
// Solution: Clean, readable, immutable, type-safe
User user = User.builder()
    .id(1L)
    .username("johndoe")
    .email("john@example.com")
    .firstName("John")
    .lastName("Doe")
    .build();
```

**Advantages:**
- ✅ Highly readable
- ✅ Immutable
- ✅ Optional parameters handled elegantly
- ✅ Validation possible
- ✅ Self-documenting
- ✅ Type-safe
- ✅ IDE autocomplete support

## Best Practices

### 1. **Use Builder When:**
- ✅ Object has many parameters (4+)
- ✅ Many optional parameters
- ✅ Need immutability
- ✅ Want validation during construction
- ✅ Complex nested objects

### 2. **Don't Use Builder When:**
- ❌ Simple objects with few parameters
- ❌ All parameters are required
- ❌ Performance is critical (slight overhead)

### 3. **Implementation Tips:**

#### Manual Builder
```java
public static class Builder<T> {
    // Builder methods return Builder for chaining
    public Builder<T> status(String status) {
        this.status = status;
        return this;
    }
    
    // Build method with validation
    public ApiResponse<T> build() {
        validate();
        return new ApiResponse<>(this);
    }
}
```

#### Lombok Builder
```java
@Data
@Builder
public class User {
    private Long id;
    private String username;
    // Lombok generates builder automatically
}
```

#### Fluent Builder
```java
// Use "with" prefix for clarity
public FluentBuilder withData(T data) {
    this.data = data;
    return this;
}
```

### 4. **Validation in Builder:**

```java
public ApiResponse<T> build() {
    // Validate required fields
    if (status == null) {
        throw new IllegalStateException("Status is required");
    }
    
    // Validate ranges
    if (statusCode < 100 || statusCode >= 600) {
        throw new IllegalStateException("Invalid status code");
    }
    
    // Validate business rules
    if (status.equals("error") && error == null) {
        throw new IllegalStateException("Error info required for error status");
    }
    
    return new ApiResponse<>(this);
}
```

### 5. **Convenience Methods:**

```java
// Static factory methods for common cases
public static <T> ApiResponse<T> success(T data) {
    return builder()
        .status("success")
        .statusCode(200)
        .message("Operation successful")
        .data(data)
        .build();
}

public static <T> ApiResponse<T> error(String message, int statusCode) {
    return builder()
        .status("error")
        .statusCode(statusCode)
        .message(message)
        .build();
}
```

## Real-World Use Cases

### 1. **REST API Responses**
```java
// Standardized API responses
return ResponseEntity.ok(
    ApiResponse.success(user)
);
```

### 2. **Configuration Objects**
```java
// Complex configuration
DatabaseConfig config = DatabaseConfig.builder()
    .host("localhost")
    .port(3306)
    .database("mydb")
    .username("user")
    .password("pass")
    .poolSize(10)
    .build();
```

### 3. **Test Data Creation**
```java
// Easy to create test objects
User testUser = User.builder()
    .id(1L)
    .username("testuser")
    .email("test@example.com")
    .build();
```

### 4. **DTOs (Data Transfer Objects)**
```java
// Complex DTOs with many fields
OrderDTO order = OrderDTO.builder()
    .id(orderId)
    .customer(customer)
    .items(items)
    .shippingAddress(address)
    .billingAddress(address)
    .build();
```

## Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test
```bash
mvn test -Dtest=ApiResponseTest
```

## Advantages Summary

| Advantage | Description | Example |
|-----------|-------------|---------|
| **Readability** | Self-documenting code | `User.builder().id(1L).username("john").build()` |
| **Immutability** | Thread-safe objects | Object cannot be modified after `build()` |
| **Optional Parameters** | Only set what you need | Omit optional fields |
| **Validation** | Validate during construction | Check required fields in `build()` |
| **Fluent API** | Method chaining | `.withData().withPagination().build()` |
| **Type Safety** | Compile-time checking | Generic types prevent errors |
| **Flexibility** | Easy variations | Different builder methods for different cases |
| **IDE Support** | Autocomplete | IDE suggests available methods |

## References

- [Builder Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/builder)
- [Effective Java - Item 2: Builder Pattern](https://www.oracle.com/technetwork/java/effectivejava-136174.html)
- [Lombok @Builder Documentation](https://projectlombok.org/features/Builder)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)

## License

This project is for educational purposes.

## Contributing

Feel free to explore, modify, and extend these examples to deepen your understanding of the Builder Pattern!

