# Backend - Example Base 17 (Spring Boot, MongoDB, JWT, RBAC)

This is the Spring Boot backend component of **Example Base 17** — a Java Spring Boot REST API with Role-Based Access Control (RBAC) using MongoDB and JWT authentication.

This is the Spring Boot equivalent of the Node.js backend, providing the same API endpoints and RBAC functionality.

---

## 🚀 Prerequisites

- **Java 21+**
- **Maven 3.6+** (or Maven wrapper)
- **MongoDB 6+** running locally or remotely
- **Port 8080** available

---

## ⚙️ Configuration

All configuration is handled in [`src/main/resources/application.properties`](src/main/resources/application.properties).  
Default MongoDB connection string (update for your environment if needed):

```
spring.data.mongodb.uri=mongodb://localhost:27017/ex_base_17_backend_spring
```

> **Tip:** No manual collection/table creation is necessary. Spring Data MongoDB creates collections automatically as needed.

---

## ▶️ Running the Backend

### Using Maven
```bash
mvn spring-boot:run
```

### Using the Packaged JAR
```bash
mvn clean package
java -jar target/backend-spring-boot-*.jar
```

---

## 📝 API Overview

### 🟢 Public Endpoints

- **Health**:  
  `GET /api/health`

- **Register**:  
  `POST /api/auth/register`  
  ```json
  {
    "username": "jane_doe",
    "password": "password123",
    "email": "jane@example.com",
    "role": "USER"
  }
  ```
  Registers a new user (role: USER by default).

- **Login**:  
  `POST /api/auth/login`  
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
  On success, returns:
  ```json
  {
    "message": "Login successful",
    "username": "jane_doe",
    "email": "jane@example.com",
    "role": "USER",
    "success": true,
    "token": "<JWT>"
  }
  ```

---

### 🔒 Protected Endpoints (**Require JWT Authorization**)

**All protected endpoints require the HTTP header:**  
`Authorization: Bearer <JWT>`

#### Users (Admin Only)

- **Get users list:**  
  `GET /api/admin/users`
  - Requires `ADMIN` role
  - Returns all user accounts

- **Get user by ID:**  
  `GET /api/admin/users/:id`
  - Requires `ADMIN` role

- **Update user role:**  
  `PATCH /api/admin/users/:id/role`  
  ```json
  {
    "role": "MANAGER"
  }
  ```
  - Requires `ADMIN` role

- **Delete user:**  
  `DELETE /api/admin/users/:id`
  - Requires `ADMIN` role

- **Admin dashboard:**  
  `GET /api/admin/dashboard`
  - Requires `ADMIN` role

#### Manager Endpoints

- **Get limited users list:**  
  `GET /api/manage/users`
  - Requires `ADMIN` or `MANAGER` role
  - Returns USER role accounts only

- **Update user:**  
  `PATCH /api/manage/users/:id`  
  ```json
  {
    "username": "new_username",
    "email": "new@example.com"
  }
  ```
  - Requires `ADMIN` or `MANAGER` role
  - Can only update USER accounts (not ADMIN or MANAGER)

- **Manager dashboard:**  
  `GET /api/manage/dashboard`
  - Requires `ADMIN` or `MANAGER` role

#### User Endpoints (Self-scope)

- **Get own profile:**  
  `GET /api/profile/profile`
  - Requires authentication
  - Returns current user's profile

- **Update own profile:**  
  `PATCH /api/profile/profile`  
  ```json
  {
    "username": "new_username",
    "email": "new@example.com"
  }
  ```
  - Requires authentication

- **Change own password:**  
  `PATCH /api/profile/password`  
  ```json
  {
    "currentPassword": "oldpass",
    "newPassword": "newpass"
  }
  ```
  - Requires authentication

- **User dashboard:**  
  `GET /api/profile/dashboard`
  - Requires authentication

---

## 🗃️ MongoDB Notes

- **Host**: `localhost:27017` (default, configurable)
- **Database**: `ex_base_17_backend_spring`
- **No authentication required by default**  
  (Configure `spring.data.mongodb.uri` for username/password if needed)
- **Collections** and **indexes** are auto-created by Spring Boot/MongoDB based on entity definitions & `@Indexed` annotation.

---

## 📖 API Documentation

Fully interactive documentation & OpenAPI specs are available:

- [Swagger UI](http://localhost:8080/swagger-ui.html)
  - Browse and test API endpoints
- [Redoc](http://localhost:8080/redoc)
  - Clean, readable auto-generated API docs
- [OpenAPI JSON](http://localhost:8080/v3/api-docs)
  - Download/open the full OpenAPI 3.0 schema (for Postman, Insomnia, etc)

---

## 📁 Project Structure Overview

```
backend-spring-boot/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/         # Security, OpenAPI config
│   │   │   ├── controller/     # REST controllers (auth, admin, manager, user)
│   │   │   ├── dto/            # API request/response DTOs
│   │   │   ├── entity/         # MongoDB entities (User, Role)
│   │   │   ├── repository/     # Spring Data MongoDB repositories
│   │   │   ├── security/       # JWT auth filter, RBAC annotation
│   │   │   └── service/        # Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/backend/
└── pom.xml
```

---

## 🎯 Key Features

- ✅ User registration & authentication
- ✅ Secure password hashing (BCrypt)
- ✅ JWT stateless authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Three roles: ADMIN, MANAGER, USER
- ✅ Protected routes with role validation
- ✅ Self-scope resources for USER role
- ✅ Limited resources for MANAGER role
- ✅ Full access for ADMIN role
- ✅ RESTful API
- ✅ Spring Security
- ✅ MongoDB backend (collections auto-created)
- ✅ Jakarta Validation for input
- ✅ Swagger/OpenAPI documentation
- ✅ Admin-only endpoints for user management

---

## 🔐 RBAC Implementation

### Role Hierarchy

1. **ADMIN** - Full system access
   - Can access all endpoints
   - Can manage all users (create, read, update, delete)
   - Can change user roles

2. **MANAGER** - Limited resource access
   - Can read/update USER accounts only
   - Cannot modify ADMIN or MANAGER accounts
   - Cannot delete users

3. **USER** - Self-scope access
   - Can only access their own profile
   - Can update their own information
   - Cannot access other users' data

### RBAC Annotation

The `@AllowRoles` annotation is used to restrict access to methods:

```java
@RestController
@RequestMapping("/api/admin")
@AllowRoles({"ADMIN"})
public class AdminController {
    // All methods require ADMIN role
}

@RestController
@RequestMapping("/api/manage")
@AllowRoles({"ADMIN", "MANAGER"})
public class ManagerController {
    // All methods require ADMIN or MANAGER role
}
```

---

## 👑 Creating an Admin User

By default, registered users have the `USER` role. To promote an account to `ADMIN`:

1. Register a user via `/api/auth/register`
2. Use your MongoDB shell or GUI:
   ```javascript
   use ex_base_17_backend_spring
   db.users.updateOne(
     { username: "YOUR_USERNAME" },
     { $set: { role: "ADMIN" } }
   )
   ```
   Or with mongo shell:
   ```bash
   mongo ex_base_17_backend_spring --eval 'db.users.updateOne({username: "YOUR_USERNAME"}, {$set: {role: "ADMIN"}})'
   ```

> **Best Practice:** Always register via the API (for password hashing), then update the role in MongoDB.

---

## 🔑 Using JWT tokens

1. **Login** to obtain a JWT via `/api/auth/login`.
2. **Authenticate** requests by sending:  
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Role-based endpoints** require both a valid token AND the appropriate role.

---

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Endpoint (with token)
```bash
curl -X GET http://localhost:8080/api/profile/profile \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### 4. Test Role-Based Access

**As USER trying to access ADMIN endpoint:**
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer <USER_TOKEN>"
```
**Expected:** `403 Forbidden`

**As ADMIN accessing ADMIN endpoint:**
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
**Expected:** `200 OK` with users list

---

## 🔄 Comparison with Node.js Backend

This Spring Boot backend provides the same functionality as the Node.js backend:

| Feature | Node.js Backend | Spring Boot Backend |
|---------|----------------|---------------------|
| Framework | Express | Spring Boot |
| Database | Mongoose | Spring Data MongoDB |
| Authentication | JWT (jsonwebtoken) | JWT (jjwt) |
| Password Hashing | bcryptjs | BCryptPasswordEncoder |
| RBAC | Middleware (`allowRoles`) | Annotation (`@AllowRoles`) |
| Port | 3000 | 8080 |
| API Endpoints | Same | Same |

Both backends are functionally equivalent and can be used interchangeably with the frontend.

---

## 📝 License

ISC

