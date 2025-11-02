# Example Base 16 - Full Stack Application

Example Base 16 is a ready-to-use full-stack web application that demonstrates a modern architecture combining a Java Spring Boot backend (with MongoDB option) and a React + Tailwind CSS frontend. The project includes user authentication, role-based access control, and comprehensive user management features.

---

## 🏗️ Architecture

```
example-base-16/
├── backend/          # Java Spring Boot REST API
│   ├── Java 21
│   ├── Spring Boot 3.3.1
│   ├── MySQL or MongoDB Database (configurable)
│   ├── JWT Authentication
│   └── Swagger/OpenAPI for API docs
│
└── frontend/         # React SPA
    ├── React 18
    ├── Vite 6
    ├── Tailwind CSS 4
    └── React Router 6
```

---

## 📋 Prerequisites

### Backend
- **Java 21+**
- **Maven 3.6+** (or Maven Wrapper)
- **MySQL 8.0+** or **MongoDB 6+** (see `backend/scripts/README.md`)
- **Port 8080** available

### Frontend
- **Node.js 18+** and **npm**
- **Port 5173** available

---

## 🚀 Quick Start

### 1. Database Setup

Choose your database and run the provided scripts:

**For MySQL:**
```bash
mysql -u root -p < backend/scripts/create-database.sql
mysql -u root -p ex_base_16_backend < backend/scripts/create-tables.sql
mysql -u root -p ex_base_16_backend < backend/scripts/create-admin-user.sql
```

**For MongoDB:**  
See `backend/scripts/README.md`.

**Default Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

### 2. Backend Configuration

Update `backend/src/main/resources/application.properties` as needed:

```properties
# For MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/ex_base_16_backend
spring.datasource.username=root
spring.datasource.password=your_password

# For MongoDB (optional)
# spring.data.mongodb.uri=mongodb://localhost:27017/ex_base_16_backend

# JWT config
jwt.secret=your-256-bit-secret-key...
jwt.expiration=86400000
```

### 3. Start Backend

```bash
cd backend
mvn spring-boot:run
```
Backend API: `http://localhost:8080`

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

---

## 📁 Project Structure

### Backend

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/                        # Configuration beans
│   │   │   ├── controller/                    # REST endpoints
│   │   │   ├── dto/                           # Data transfer objects
│   │   │   ├── entity/                        # JPA Entities / MongoDB Schemas
│   │   │   ├── repository/                    # JPA/Mongo repositories
│   │   │   ├── security/                      # JWT and security
│   │   │   └── service/                       # Business logic
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/
│   │           ├── init.sql
│   │           └── schema.sql
│   └── test/
├── scripts/
│   ├── create-database.sql
│   ├── create-tables.sql
│   ├── create-admin-user.sql
│   └── (see README.md for MongoDB scripts)
└── pom.xml
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
└── package.json
```

---

## 🔌 API Endpoints

### Public
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | `/api/auth/register`    | User registration     |
| POST   | `/api/auth/login`       | Obtain JWT token      |
| GET    | `/api/health`           | Service health check  |

### Protected (require JWT)
| Method | Endpoint                     | Role       | Description               |
|--------|------------------------------|------------|---------------------------|
| POST   | `/api/auth/change-password`  | Any        | Change your password      |
| GET    | `/api/users`                 | ADMIN      | List all users            |
| POST   | `/api/users/reset-password`  | ADMIN      | Reset any user password   |

### API Docs
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🔐 Authentication Flow

1. Registration or login via `/api/auth/register` or `/api/auth/login`
2. JWT token is received & stored in browser localStorage
3. All API requests include `Authorization: Bearer <token>` header
4. Backend validates token and role on every protected route

---

## 🎨 Frontend Routes

| Route              | Access     | Description                       |
|--------------------|-----------|-----------------------------------|
| `/`                | Public    | Redirects to `/dashboard`         |
| `/login`           | Public    | Login page                        |
| `/register`        | Public    | User registration                 |
| `/dashboard`       | Auth      | User dashboard                    |
| `/change-password` | Auth      | Change your password              |
| `/users`           | ADMIN     | User management page (Admin only) |

---

## ✨ Features

### Backend
- User registration, login & JWT authentication
- BCrypt password hashing
- Input validation with Jakarta Validation
- Role-based access control (RBAC): USER, ADMIN
- API documentation with Swagger & OpenAPI
- MySQL (JPA) or MongoDB (Spring Data MongoDB)
- Database scripts for easy setup

### Frontend
- Modern React 18 SPA, Vite, Tailwind CSS
- Context API for authentication state
- JWT token management and route protection
- Responsive, accessible UI
- Admin panel for user management

---

## 🗄️ Database Schema (MySQL)

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

See `backend/scripts/README.md` for MongoDB collections/scripts.

---

## 🔧 Configuration

### Backend

See and edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ex_base_16_backend
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000
```

Or for MongoDB:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/ex_base_16_backend
```

### Frontend

API proxy configuration is available in `frontend/vite.config.js`:

```javascript
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true
  }
}
```

---

## 📝 Usage Examples

- **Register User**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123","email":"john@example.com"}'
```

- **Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

- **Change Password**
```bash
curl -X POST http://localhost:8080/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{"currentPassword":"password123","newPassword":"newpass456","confirmPassword":"newpass456"}'
```

- **Get All Users (Admin)**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <admin-jwt-token>"
```

- **Reset User Password (Admin)**
```bash
curl -X POST http://localhost:8080/api/users/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{"username":"john_doe","newPassword":"newpassword123"}'
```

---

## 🧪 Testing

- **Backend**
    ```bash
    cd backend
    mvn test
    ```
- **Frontend Build**
    ```bash
    cd frontend
    npm run build
    ```

---

## 🛠️ Development

- **Backend**
    ```bash
    cd backend
    mvn spring-boot:run
    ```
    - Hot reload via Spring DevTools
    - API docs at `/swagger-ui.html`

- **Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    - HMR enabled
    - API proxy setup for `/api`

---

## 📚 Additional Resources

- **Backend:** See `backend/README.md` for expanded setup, architecture, and MongoDB details.
- **Frontend:** See `frontend/README.md` for advanced React usage.
- **Database:** See `backend/scripts/README.md` for all MySQL and MongoDB scripts and guidance.

---

## 🔒 Security Features

- Secure password hashing (BCrypt)
- JWT with strong secret
- HTTPS ready for production
- Complete input validation server-side
- JPA/Hibernate for SQLi protection
- React for XSS mitigation

---

## 🚨 Troubleshooting

**Backend**
- Verify database is running and credentials are correct (`application.properties`).
- Ensure database `ex_base_16_backend` (or MongoDB collection) exists.
- Free up port 8080 or change via `server.port=xxxx`.

**Frontend**
- Make sure backend is running on the expected port.
- Check proxy configuration if API calls fail.
- If JWT token expired: login again for a new one.

---

## 📄 License

This project is available for educational and demonstration purposes.

---

## 👥 Contributing

1. Fork this repo
2. Create your feature branch
3. Commit and push your changes
4. Submit a PR!

---

## 🎯 Future Enhancements

- [ ] Email verification for registration
- [ ] Password reset via email
- [ ] User profile management
- [ ] Two-factor authentication (2FA)
- [ ] Refresh token support (JWT)
- [ ] Rate limiting
- [ ] API versioning
- [ ] Improved test coverage
- [ ] Docker / Compose deployment
- [ ] CI/CD pipeline

