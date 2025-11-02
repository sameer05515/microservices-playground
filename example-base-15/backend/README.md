# Backend - Spring Boot Application

A Spring Boot backend application with authentication and MySQL database.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ (or use Maven wrapper)
- MySQL 8.0+ installed and running on localhost

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

### Database Setup

Before running the application, ensure MySQL is running and create a database.

**Option 1: Using SQL Scripts (Recommended)**

Database initialization scripts are available in the `scripts/` directory:

```bash
# Create database
mysql -u root -p < scripts/create-database.sql

# Create tables (optional - Hibernate will create them automatically)
mysql -u root -p ex_base_15_backend < scripts/create-tables.sql

# Create default admin user (optional)
mysql -u root -p ex_base_15_backend < scripts/create-admin-user.sql
```

**Option 2: Manual Setup**

```sql
CREATE DATABASE IF NOT EXISTS ex_base_15_backend
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

**Database Configuration:**
- **Host**: `localhost:3306`
- **Database**: `ex_base_15_backend` (will be created automatically if `createDatabaseIfNotExist=true`)
- **Username**: `root` (update in `application.properties` if different)
- **Password**: Update in `application.properties` to match your MySQL password

You can update the database credentials in `src/main/resources/application.properties`.

**Note:** The application is configured to auto-create tables via Hibernate (`spring.jpa.hibernate.ddl-auto=update`), so you may only need to create the database.

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
- ✅ MySQL Database (configurable)
- ✅ Spring Security with JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ BCrypt password encoding
- ✅ Input validation with Jakarta Validation
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation with interactive UI
- ✅ Admin-only endpoint for user management

## Creating an Admin User

By default, new users are created with the `USER` role. To create an admin user:

1. Connect to your MySQL database using any MySQL client (e.g., MySQL Workbench, phpMyAdmin, or command line)
2. Run this SQL to update a user to ADMIN role:
   ```sql
   USE backend_db;
   UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
   ```
3. Or register a user via `/api/auth/register`, then update the role:
   ```sql
   USE backend_db;
   UPDATE users SET role = 'ADMIN' WHERE username = 'registered_username';
   ```
   Note: It's recommended to register the user first (to get a properly BCrypt-encoded password), then update the role.

## Using JWT Tokens

1. **Login** to get a JWT token from `/api/auth/login`
2. **Use the token** in subsequent requests by adding it to the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Admin endpoints** require both a valid token AND the ADMIN role

