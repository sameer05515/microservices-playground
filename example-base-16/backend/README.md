# Backend - Example Base 16 (Spring Boot, MongoDB, JWT)

This is the backend component of **Example Base 16** — a modern Spring Boot REST API with user authentication, role-based access control (RBAC), secure password hashing, and MongoDB data storage.

---

## 🚀 Prerequisites

- **Java 21+**
- **Maven 3.6+** (or Maven wrapper)
- **MongoDB 6 or above, running locally or remotely**
- **Port 8080** available

---

## ⚙️ Configuration

All configuration is handled in [`src/main/resources/application.properties`](src/main/resources/application.properties).  
Default MongoDB connection string (update for your environment if needed):

```
spring.data.mongodb.uri=mongodb://localhost:27017/ex_base_16_backend
```

> **Tip:** No manual collection/table creation is necessary. Spring Data MongoDB creates collections automatically as needed.

Default admin credentials are only set if you initialize the DB separately; see project root [README](../README.md) for MySQL/MongoDB setup scripts.

---

## ▶️ Running the Backend

### Using Maven
```bash
mvn spring-boot:run
```

### Using the Packaged JAR
```bash
mvn clean package
java -jar target/backend-*.jar
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
    "email": "jane@example.com"
  }
  ```
  Registers a new user (role: USER).

- **Login**:  
  `POST /api/auth/login`  
  ```json
  {
    "username": "jane_doe",
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
  `GET /api/users`
  - Requires `ADMIN` role
  - Returns all user accounts

- **Reset user password:**  
  `POST /api/users/reset-password`  
  ```json
  {
    "username": "target_user",
    "newPassword": "replaceme123"
  }
  ```
  - Requires `ADMIN` role

#### Any logged-in user

- **Change own password:**  
  `POST /api/auth/change-password`  
  ```json
  {
    "currentPassword": "oldpass",
    "newPassword": "newpass",
    "confirmPassword": "newpass"
  }
  ```

---

## 🗃️ MongoDB Notes

- **Host**: `localhost:27017` (default, configurable)
- **Database**: `ex_base_16_backend`
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
backend/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/         # Security, OpenAPI, Database config
│   │   │   ├── controller/     # REST controllers (auth, users, health)
│   │   │   ├── dto/            # API request/response POJOs
│   │   │   ├── entity/         # MongoDB entities (e.g. User)
│   │   │   ├── repository/     # Spring Data MongoDB repositories
│   │   │   ├── security/       # JWT auth provider/filter
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
- ✅ Role-based access control (RBAC)
- ✅ RESTful API
- ✅ Spring Security
- ✅ MongoDB backend (collections auto-created)
- ✅ Jakarta Validation for input
- ✅ Swagger/OpenAPI documentation
- ✅ Admin-only endpoints for user management

---

## 👑 Creating an Admin User

By default, registered users have the `USER` role. To promote an account to `ADMIN`:

1. Register a user via `/api/auth/register`
2. Use your MongoDB shell or GUI:
   ```js
   use ex_base_16_backend
   db.users.updateOne(
     { username: "YOUR_USERNAME" },
     { $set: { role: "ADMIN" } }
   )
   ```
   Or with mongo shell:
   ```bash
   mongo ex_base_16_backend --eval 'db.users.updateOne({username: "YOUR_USERNAME"}, {$set: {role: "ADMIN"}})'
   ```
> **Best Practice:** Always register via the API (for password hashing), then update the role in MongoDB.

---

## 🔑 Using JWT tokens

1. **Login** to obtain a JWT via `/api/auth/login`.
2. **Authenticate** requests by sending:  
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Admin endpoints** require both a valid token AND `role: ADMIN`.

---

