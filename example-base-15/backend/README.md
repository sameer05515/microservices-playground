# Backend - Spring Boot Application

A Spring Boot backend application with authentication and H2 database.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ (or use Maven wrapper)

## Running the Application

### Using Maven
```bash
mvn spring-boot:run
```

### Using Java directly
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Endpoints

### Public Endpoints

- **Health Check**: `GET http://localhost:8080/api/health`
- **Register User**: `POST http://localhost:8080/api/auth/register`
  ```json
  {
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com"
  }
  ```
- **Login**: `POST http://localhost:8080/api/auth/login`
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```

### H2 Console

- **H2 Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (leave empty)

### API Documentation (Swagger/OpenAPI)

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
  - Interactive API documentation
  - Test endpoints directly from the browser
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
  - OpenAPI 3.0 specification in JSON format

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   └── HealthController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── RegisterRequest.java
│   │   │   ├── entity/
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java
│   │   │   └── service/
│   │   │       └── UserService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/backend/
│           └── BackendApplicationTests.java
└── pom.xml
```

## Features

- ✅ User Registration with validation
- ✅ User Login with password verification
- ✅ H2 In-Memory Database
- ✅ Spring Security for authentication
- ✅ BCrypt password encoding
- ✅ Input validation with Jakarta Validation
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation with interactive UI

