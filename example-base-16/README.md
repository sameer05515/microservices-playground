# Example Base 16 - Full Stack Application

A full-stack web application featuring a Spring Boot backend with MySQL database and a React frontend with Tailwind CSS. The application provides user authentication, role-based access control, and user management capabilities.

## 🏗️ Architecture

```
example-base-16/
├── backend/          # Spring Boot REST API
│   ├── Java 21
│   ├── Spring Boot 3.3.1
│   ├── MySQL Database
│   ├── JWT Authentication
│   └── Swagger/OpenAPI
│
└── frontend/         # React SPA
    ├── React 18
    ├── Vite 6
    ├── Tailwind CSS 4
    └── React Router 6
```

## 📋 Prerequisites

### Backend
- **Java 21** or higher
- **Maven 3.6+** (or use Maven wrapper)
- **MySQL 8.0+** installed and running on localhost
- **Port 8080** available

### Frontend
- **Node.js 18+** and npm
- **Port 5173** available

## 🚀 Quick Start

### 1. Database Setup

First, set up the MySQL database:

```bash
# Create the database
mysql -u root -p < backend/scripts/create-database.sql

# (Optional) Create tables manually (Hibernate will auto-create them)
mysql -u root -p ex_base_15_backend < backend/scripts/create-tables.sql

# (Optional) Create default admin user
mysql -u root -p ex_base_15_backend < backend/scripts/create-admin-user.sql
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change the password immediately after first login!

### 2. Backend Configuration

Update database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 3. Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will be available at `http://localhost:8080`

### 4. Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/
│   │   │   │   ├── OpenApiConfig.java        # Swagger configuration
│   │   │   │   ├── SecurityConfig.java       # Spring Security & JWT
│   │   │   │   └── DatabaseConfig.java       # Database diagnostics
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java       # Authentication endpoints
│   │   │   │   ├── UserController.java        # User management (Admin)
│   │   │   │   └── HealthController.java      # Health check
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── ChangePasswordRequest.java
│   │   │   │   ├── ChangePasswordResponse.java
│   │   │   │   ├── ResetPasswordRequest.java
│   │   │   │   └── UserResponse.java
│   │   │   ├── entity/
│   │   │   │   └── User.java                  # User entity
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java        # JPA repository
│   │   │   ├── security/
│   │   │   │   ├── JwtTokenProvider.java      # JWT token generation/validation
│   │   │   │   └── JwtAuthenticationFilter.java  # JWT filter
│   │   │   └── service/
│   │   │       └── UserService.java           # Business logic
│   │   └── resources/
│   │       ├── application.properties         # Configuration
│   │       └── db/
│   │           ├── init.sql                   # Database initialization
│   │           └── schema.sql                 # Schema definition
│   └── test/
│       └── java/com/p/backend/
│           └── BackendApplicationTests.java
├── scripts/
│   ├── create-database.sql
│   ├── create-tables.sql
│   ├── create-admin-user.sql
│   └── drop-database.sql
└── pom.xml
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx                          # Login page
│   │   ├── Register.jsx                        # Registration page
│   │   ├── Dashboard.jsx                      # User dashboard
│   │   ├── ChangePassword.jsx                 # Change own password
│   │   ├── UserList.jsx                        # User management (Admin)
│   │   ├── ResetPassword.jsx                   # Reset user password modal
│   │   ├── ProtectedRoute.jsx                 # Route protection wrapper
│   │   └── PublicRoute.jsx                    # Public route wrapper
│   ├── context/
│   │   └── AuthContext.jsx                    # Authentication context
│   ├── services/
│   │   ├── authApi.js                         # Authentication API calls
│   │   └── userApi.js                         # User management API calls
│   ├── App.jsx                                 # Main app with routing
│   ├── main.jsx                                # Entry point
│   └── index.css                               # Tailwind CSS
├── vite.config.js                              # Vite configuration
└── package.json
```

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### Protected Endpoints (Require Authentication)

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/change-password` | Any authenticated user | Change own password |
| `GET` | `/api/users` | ADMIN | Get all users |
| `POST` | `/api/users/reset-password` | ADMIN | Reset any user's password |

### API Documentation

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## 🔐 Authentication Flow

1. **Register/Login**: User authenticates and receives JWT token
2. **Token Storage**: JWT token stored in localStorage
3. **API Requests**: Token automatically included in `Authorization: Bearer <token>` header
4. **Token Validation**: Backend validates token on each protected request
5. **Role-Based Access**: Admin routes check for `ADMIN` role in token

## 🎨 Frontend Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/dashboard` |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/dashboard` | Authenticated | User dashboard |
| `/change-password` | Authenticated | Change own password |
| `/users` | ADMIN only | User management page |

## ✨ Features

### Backend Features

- ✅ **User Registration & Authentication**
  - JWT-based authentication
  - BCrypt password encoding
  - Input validation with Jakarta Validation

- ✅ **Role-Based Access Control (RBAC)**
  - USER and ADMIN roles
  - Protected endpoints based on roles

- ✅ **Password Management**
  - Users can change their own password
  - Admins can reset any user's password

- ✅ **User Management**
  - Admin-only endpoint to view all users
  - User information display

- ✅ **API Documentation**
  - Swagger/OpenAPI integration
  - Interactive API testing

- ✅ **Database**
  - MySQL database with JPA/Hibernate
  - Auto table creation
  - Database initialization scripts

### Frontend Features

- ✅ **Modern React Application**
  - React 18 with hooks
  - React Router 6 for navigation
  - Context API for state management

- ✅ **User Interface**
  - Tailwind CSS for styling
  - Responsive design
  - Loading states and error handling

- ✅ **Authentication**
  - Login and registration forms
  - JWT token management
  - Protected routes
  - Automatic token refresh on 401 errors

- ✅ **User Management (Admin)**
  - View all users
  - Reset user passwords
  - Role-based UI visibility

- ✅ **Password Management**
  - Change password functionality
  - Form validation
  - Success/error feedback

## 🗄️ Database Schema

### Users Table

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

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ex_base_15_backend
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
jwt.secret=your-256-bit-secret-key...
jwt.expiration=86400000  # 24 hours
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. Edit `frontend/vite.config.js` if needed:

```javascript
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true,
  },
}
```

## 📝 Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Change Password (Authenticated)

```bash
curl -X POST http://localhost:8080/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456",
    "confirmPassword": "newpassword456"
  }'
```

### Get All Users (Admin Only)

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <admin-jwt-token>"
```

### Reset User Password (Admin Only)

```bash
curl -X POST http://localhost:8080/api/users/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{
    "username": "john_doe",
    "newPassword": "newpassword123"
  }'
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Build

```bash
cd frontend
npm run build
```

## 🛠️ Development

### Backend Development

```bash
cd backend
mvn spring-boot:run
```

- Hot reload enabled with Spring Boot DevTools
- Database changes auto-applied via Hibernate
- Swagger UI available at `/swagger-ui.html`

### Frontend Development

```bash
cd frontend
npm run dev
```

- Hot Module Replacement (HMR) enabled
- Fast refresh for React components
- Proxy to backend API at `/api`

## 📚 Additional Resources

- **Backend README**: See `backend/README.md` for detailed backend documentation
- **Frontend README**: See `frontend/README.md` for frontend-specific details
- **Database Scripts**: See `backend/scripts/README.md` for database setup scripts

## 🔒 Security Features

- **Password Security**: BCrypt hashing with strength 10
- **JWT Tokens**: Secure token-based authentication
- **HTTPS Ready**: Configure SSL certificates for production
- **Input Validation**: Server-side validation on all inputs
- **SQL Injection Protection**: JPA/Hibernate parameterized queries
- **XSS Protection**: React's built-in XSS protection

## 🚨 Troubleshooting

### Backend Issues

**Database Connection Failed**
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify database `ex_base_15_backend` exists

**Port 8080 Already in Use**
- Change port in `application.properties`: `server.port=8081`
- Update frontend proxy configuration accordingly

### Frontend Issues

**API Calls Failing**
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

**Token Not Working**
- Check if token is stored in localStorage
- Verify token hasn't expired (24 hours default)
- Re-login to get a new token

## 📄 License

This project is for educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎯 Future Enhancements

- [ ] Email verification for registration
- [ ] Password reset via email
- [ ] User profile management
- [ ] Two-factor authentication (2FA)
- [ ] Refresh token mechanism
- [ ] Rate limiting
- [ ] API versioning
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

