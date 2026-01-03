# Custom Exception Handling in Spring Boot

This Spring Boot application demonstrates a comprehensive, reusable, and scalable approach to exception handling using custom exceptions, `@ControllerAdvice`, and `@ExceptionHandler` annotations.

## Table of Contents

- [Design Approach](#design-approach)
- [Key Components](#key-components)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Exception Types](#exception-types)
- [Error Response Structure](#error-response-structure)
- [How Components Interact](#how-components-interact)
- [Best Practices](#best-practices)

## Design Approach

### 1. **Base Exception Class**
All custom exceptions extend `BaseException`, which provides:
- HTTP status code
- Error code (for programmatic handling)
- Error message
- **Dynamic parameters** (Map<String, Object>) for flexibility
- Timestamp

### 2. **Global Exception Handler**
A single `@ControllerAdvice` class handles all exceptions:
- Centralized exception handling
- Consistent error response format
- No need for try-catch in controllers
- Easy to extend with new exception types

### 3. **Custom Error Response DTO**
Standardized `ErrorResponse` structure:
- Consistent format across all errors
- Dynamic parameters support
- Path information for debugging
- Optional stack trace (development only)

### 4. **Reusable and Scalable Structure**
- **BaseException**: Foundation for all custom exceptions
- **Specific Exceptions**: Extend BaseException for specific scenarios
- **Global Handler**: Handles all exceptions in one place
- **Easy Extension**: Add new exception types without modifying existing code

## Key Components

### 1. BaseException (Abstract Base Class)

```java
public abstract class BaseException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorCode;
    private final Map<String, Object> parameters; // Dynamic parameters
    private final LocalDateTime timestamp;
    
    // Method to add dynamic parameters
    public BaseException withParameter(String key, Object value) {
        this.parameters.put(key, value);
        return this;
    }
}
```

**Benefits:**
- All exceptions share common structure
- Dynamic parameter support
- Consistent error information
- Easy to extend

### 2. Custom Exceptions

#### InvalidEmailException
```java
public class InvalidEmailException extends BaseException {
    public InvalidEmailException(String email) {
        super(HTTP_STATUS, ERROR_CODE, "Invalid email format: " + email);
        this.withParameter("email", email);
        this.withParameter("expectedFormat", "user@example.com");
    }
}
```

#### ResourceNotFoundException
```java
public class ResourceNotFoundException extends BaseException {
    public ResourceNotFoundException(String resourceType, Object resourceId) {
        super(HTTP_STATUS, ERROR_CODE, 
            resourceType + " with ID '" + resourceId + "' not found");
        this.withParameter("resourceType", resourceType);
        this.withParameter("resourceId", resourceId);
    }
}
```

### 3. GlobalExceptionHandler

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    // Generic handler for all BaseException subclasses
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(
            BaseException ex, HttpServletRequest request) {
        // Build and return ErrorResponse
    }
    
    // Specific handlers for specific exceptions (optional)
    @ExceptionHandler(InvalidEmailException.class)
    public ResponseEntity<ErrorResponse> handleInvalidEmailException(...) {
        // Custom logic if needed
    }
    
    // Handler for Spring validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(...) {
        // Convert validation errors to ErrorResponse
    }
    
    // Fallback for unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(...) {
        // Handle unexpected errors
    }
}
```

### 4. ErrorResponse DTO

```java
@Builder
public class ErrorResponse {
    private int status;                    // HTTP status code
    private String errorCode;              // Programmatic error code
    private String message;                // Human-readable message
    private Map<String, Object> parameters; // Dynamic parameters
    private LocalDateTime timestamp;        // When error occurred
    private String path;                   // API path
    private String stackTrace;             // Only in development
}
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REST Controllers                         │
│  (No try-catch blocks needed)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Throws Exceptions
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer                              │
│  - Business Logic                                           │
│  - Validation                                                │
│  - Throws Custom Exceptions                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Custom Exceptions
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Custom Exception Classes                       │
│  - InvalidEmailException                                     │
│  - ResourceNotFoundException                                │
│  - ValidationException                                      │
│  - BusinessLogicException                                   │
│  (All extend BaseException)                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Caught by
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           GlobalExceptionHandler                            │
│  (@ControllerAdvice)                                        │
│  - @ExceptionHandler methods                                │
│  - Converts exceptions to ErrorResponse                     │
│  - Returns ResponseEntity<ErrorResponse>                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Returns
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              ErrorResponse DTO                               │
│  - Standardized structure                                    │
│  - Dynamic parameters                                        │
│  - Consistent format                                        │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.6+
- Spring Boot 3.3.1

### Installation

1. **Navigate to the project**:
   ```bash
   cd example-base-20/exception-handling-demonstrate
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

### User Management

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "createdAt": "2024-01-15T10:30:00"
}
```

**Error Response (400) - Invalid Email:**
```json
{
  "status": 400,
  "errorCode": "INVALID_EMAIL",
  "message": "Invalid email format: 'invalid@'. Reason: Email domain must contain a dot",
  "parameters": {
    "email": "invalid@",
    "reason": "Email domain must contain a dot",
    "expectedFormat": "user@example.com",
    "field": "email"
  },
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/users"
}
```

#### Get User by ID
```http
GET /api/users/{id}
```

**Error Response (404) - Not Found:**
```json
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "User with ID '999' not found",
  "parameters": {
    "resourceType": "User",
    "resourceId": "999",
    "searchedId": 999,
    "availableIds": [1, 2, 3]
  },
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/users/999"
}
```

#### Get User by Email
```http
GET /api/users/email/{email}
```

#### Delete User
```http
DELETE /api/users/{id}
```

**Error Response (422) - Business Logic Violation:**
```json
{
  "status": 422,
  "errorCode": "BUSINESS_LOGIC_ERROR",
  "message": "Cannot delete user with ID 1 because they have active orders",
  "parameters": {
    "businessRule": "USER_HAS_ACTIVE_ORDERS",
    "userId": 1,
    "reason": "Active orders exist",
    "action": "Please cancel or complete all orders before deleting the user"
  },
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/users/1"
}
```

### Exception Demo Endpoints

#### Invalid Email Exception
```http
GET /api/demo/exceptions/invalid-email?email=invalid@
```

#### Resource Not Found Exception
```http
GET /api/demo/exceptions/not-found?resourceType=User&resourceId=123
```

#### Validation Exception
```http
GET /api/demo/exceptions/validation-multiple
```

#### Business Logic Exception
```http
GET /api/demo/exceptions/business-logic
```

### API Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Exception Types

### 1. InvalidEmailException
- **HTTP Status**: 400 (Bad Request)
- **Error Code**: `INVALID_EMAIL`
- **Use Case**: Invalid email format validation
- **Dynamic Parameters**: `email`, `expectedFormat`, `reason`, `field`

### 2. ResourceNotFoundException
- **HTTP Status**: 404 (Not Found)
- **Error Code**: `RESOURCE_NOT_FOUND`
- **Use Case**: Requested resource doesn't exist
- **Dynamic Parameters**: `resourceType`, `resourceId`, `searchedId`

### 3. ValidationException
- **HTTP Status**: 400 (Bad Request)
- **Error Code**: `VALIDATION_ERROR`
- **Use Case**: Multiple validation errors
- **Dynamic Parameters**: `fieldErrors` (Map of field -> error message)

### 4. BusinessLogicException
- **HTTP Status**: 422 (Unprocessable Entity)
- **Error Code**: `BUSINESS_LOGIC_ERROR`
- **Use Case**: Business rule violations
- **Dynamic Parameters**: `businessRule`, context information

## Error Response Structure

All error responses follow this structure:

```json
{
  "status": 400,                    // HTTP status code
  "errorCode": "INVALID_EMAIL",     // Programmatic error code
  "message": "Invalid email...",    // Human-readable message
  "parameters": {                   // Dynamic parameters
    "email": "invalid@",
    "field": "email",
    "expectedFormat": "user@example.com"
  },
  "timestamp": "2024-01-15T10:30:00", // When error occurred
  "path": "/api/users"              // API endpoint
}
```

### Dynamic Parameters

The `parameters` field allows flexibility to add any key-value pairs:

```java
// Example 1: Simple parameter
throw new InvalidEmailException(email)
    .withParameter("field", "email");

// Example 2: Multiple parameters
throw new ResourceNotFoundException("User", id)
    .withParameter("searchedId", id)
    .withParameter("availableIds", availableIds)
    .withParameter("suggestion", "Please check the ID");

// Example 3: Complex object
throw new BusinessLogicException(message)
    .withParameters(Map.of(
        "rule", "USER_HAS_ACTIVE_ORDERS",
        "userId", 123,
        "activeOrders", 5
    ));
```

## How Components Interact

### Flow Example: Creating User with Invalid Email

1. **Client Request**:
   ```http
   POST /api/users
   {
     "email": "invalid@"
   }
   ```

2. **Controller** (`UserController.createUser`):
   - Receives request
   - Validates with `@Valid` annotation
   - Calls `userService.createUser()`
   - **No try-catch needed!**

3. **Service** (`UserService.createUser`):
   - Validates email format
   - Throws `InvalidEmailException` if invalid:
     ```java
     throw new InvalidEmailException(email, reason)
         .withParameter("field", "email");
     ```

4. **GlobalExceptionHandler**:
   - Catches `InvalidEmailException`
   - Extracts exception information
   - Builds `ErrorResponse`:
     ```java
     ErrorResponse.builder()
         .status(400)
         .errorCode("INVALID_EMAIL")
         .message(ex.getMessage())
         .parameters(ex.getParameters())
         .path(request.getRequestURI())
         .build();
     ```

5. **Response**:
   ```json
   {
     "status": 400,
     "errorCode": "INVALID_EMAIL",
     "message": "Invalid email format: 'invalid@'...",
     "parameters": {
       "email": "invalid@",
       "field": "email"
     },
     "path": "/api/users"
   }
   ```

### Benefits of This Design

1. **No Try-Catch in Controllers**: Clean, readable controller code
2. **Consistent Error Format**: All errors follow the same structure
3. **Centralized Handling**: All exception logic in one place
4. **Easy to Extend**: Add new exception types without modifying handlers
5. **Dynamic Parameters**: Flexibility to add context-specific information
6. **Type Safety**: Compile-time checking for exception types

## Best Practices

### 1. **Exception Hierarchy**
- Use `BaseException` as the foundation
- Create specific exceptions for specific scenarios
- Group related exceptions logically

### 2. **Error Codes**
- Use consistent naming (e.g., `INVALID_EMAIL`, `RESOURCE_NOT_FOUND`)
- Make them programmatically useful
- Document them in API documentation

### 3. **Dynamic Parameters**
- Use for context-specific information
- Keep parameter names consistent
- Don't include sensitive information

### 4. **HTTP Status Codes**
- Use appropriate status codes (400, 404, 422, 500)
- Follow REST conventions
- Document status codes in API docs

### 5. **Logging**
- Log exceptions at appropriate levels
- Include context information
- Don't log sensitive data

### 6. **Testing**
- Test exception handling
- Test error response structure
- Test dynamic parameters

## Extending the Design

### Adding a New Exception Type

1. **Create Exception Class**:
   ```java
   public class DuplicateResourceException extends BaseException {
       public DuplicateResourceException(String resourceType, String field, Object value) {
           super(HttpStatus.CONFLICT, "DUPLICATE_RESOURCE",
               String.format("%s with %s '%s' already exists", resourceType, field, value));
           this.withParameter("resourceType", resourceType);
           this.withParameter("field", field);
           this.withParameter("value", value);
       }
   }
   ```

2. **Add Handler** (Optional - BaseException handler will work):
   ```java
   @ExceptionHandler(DuplicateResourceException.class)
   public ResponseEntity<ErrorResponse> handleDuplicateResource(...) {
       // Custom logic if needed
   }
   ```

3. **Use in Service**:
   ```java
   throw new DuplicateResourceException("User", "email", email);
   ```

That's it! No changes needed to existing code.

## Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test
```bash
mvn test -Dtest=InvalidEmailExceptionTest
```

## Summary

This design provides:

✅ **Reusable**: BaseException can be extended for any scenario  
✅ **Scalable**: Easy to add new exception types  
✅ **Consistent**: All errors follow the same structure  
✅ **Flexible**: Dynamic parameters allow context-specific information  
✅ **Clean**: No try-catch blocks in controllers  
✅ **Maintainable**: Centralized exception handling  

The combination of `BaseException`, `GlobalExceptionHandler`, and `ErrorResponse` creates a robust, production-ready exception handling system.

## References

- [Spring Exception Handling](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc)
- [@ControllerAdvice Documentation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ControllerAdvice.html)
- [REST API Error Handling Best Practices](https://www.baeldung.com/rest-api-error-handling-best-practices)

## License

This project is for educational purposes.

