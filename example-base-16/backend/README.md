# Backend - Spring Boot Application

A Spring Boot backend application with authentication and MongoDB database.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ (or use Maven wrapper)
- MongoDB 4.4+ installed and running on localhost

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
  Response includes a JWT token:
  ```json
  {
    "message": "Login successful",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Protected Endpoints (Require Authentication)

- **Get All Users** (Admin Only): `GET http://localhost:8080/api/users`
  - **Authorization**: Include JWT token in the header: `Authorization: Bearer <token>`
  - **Role Required**: ADMIN
  - Returns a list of all users (id, username, email, role, enabled status)

- **Reset User Password** (Admin Only): `POST http://localhost:8080/api/users/reset-password`
  - **Authorization**: Include JWT token in the header: `Authorization: Bearer <token>`
  - **Role Required**: ADMIN
  - Request body:
    ```json
    {
      "username": "target_user",
      "newPassword": "newpassword123"
    }
    ```
  - Response:
    ```json
    {
      "message": "Password reset successfully for user: target_user",
      "success": true
    }
    ```

- **Change Password**: `POST http://localhost:8080/api/auth/change-password`
  - **Authorization**: Include JWT token in the header: `Authorization: Bearer <token>`
  - **Required for**: Logged-in users (any role)
  - Request body:
    ```json
    {
      "currentPassword": "oldpassword123",
      "newPassword": "newpassword456",
      "confirmPassword": "newpassword456"
    }
    ```
  - Response:
    ```json
    {
      "message": "Password changed successfully",
      "success": true
    }
    ```

### Database Setup

Before running the application, ensure MongoDB is running on localhost.

**MongoDB Configuration:**
- **Host**: `localhost:27017`
- **Database**: `ex_base_16_backend` (will be created automatically on first write)
- **No authentication required by default** (configure if needed in MongoDB)

**MongoDB Connection String:**
```
mongodb://localhost:27017/ex_base_16_backend
```

You can update the database connection string in `src/main/resources/application.properties`.

**Note:** 
- Collections (tables) are created automatically on first insert
- Indexes are created automatically based on `@Indexed` annotations
- No manual database creation required

### API Documentation

The application provides multiple ways to access API documentation:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
  - Interactive API documentation
  - Test endpoints directly from the browser
  
- **Redoc**: `http://localhost:8080/redoc`
  - Beautiful, responsive API documentation
  - Clean, readable interface
  - Perfect for sharing with stakeholders
  
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
  - OpenAPI 3.0 specification in JSON format
  - Can be imported into Postman, Insomnia, or other API tools

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
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtTokenProvider.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── HealthController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   └── UserResponse.java
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
- ✅ User Login with password verification and JWT token generation
- ✅ MongoDB Database (configurable)
- ✅ Spring Security with JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ BCrypt password encoding
- ✅ Input validation with Jakarta Validation
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation with interactive UI
- ✅ Admin-only endpoint for user management
- ✅ Admin password reset functionality

## Creating an Admin User

By default, new users are created with the `USER` role. To create an admin user:

1. Register a user via `/api/auth/register`
2. Connect to MongoDB using MongoDB Compass, mongo shell, or any MongoDB client
3. Update the user's role to ADMIN:
   ```javascript
   use ex_base_16_backend
   db.users.updateOne(
     { username: "your_username" },
     { $set: { role: "ADMIN" } }
   )
   ```
   
   Or using mongo shell command:
   ```bash
   mongo ex_base_16_backend --eval 'db.users.updateOne({username: "your_username"}, {$set: {role: "ADMIN"}})'
   ```

**Note:** It's recommended to register the user first (to get a properly BCrypt-encoded password), then update the role.

## Using JWT Tokens

1. **Login** to get a JWT token from `/api/auth/login`
2. **Use the token** in subsequent requests by adding it to the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Admin endpoints** require both a valid token AND the ADMIN role

