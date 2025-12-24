# Backend - Example Base 17 (Python FastAPI, MongoDB, JWT, RBAC)

This is the Python FastAPI backend component of **Example Base 17** — a FastAPI REST API with Role-Based Access Control (RBAC) using MongoDB and JWT authentication.

This is the Python equivalent of the Node.js backend, providing the same API endpoints and RBAC functionality.

---

## 🚀 Prerequisites

- **Python 3.10+**
- **pip** (Python package manager)
- **MongoDB 6+** running locally or remotely
- **Port 8000** available

---

## ⚙️ Configuration

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```
   PORT=8000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_HOURS=24
   MONGODB_URI=mongodb://localhost:27017/ex_base_17_backend_python
   ```

> **Tip:** No manual collection/table creation is necessary. MongoDB creates collections automatically as needed.

---

## 📦 Installation

### Using Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Direct Installation

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Backend

### Development Mode
```bash
python run.py
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The server will start on `http://localhost:8000`

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
  `GET /api/admin/users/{id}`
  - Requires `ADMIN` role

- **Update user role:**  
  `PATCH /api/admin/users/{id}/role`  
  ```json
  {
    "role": "MANAGER"
  }
  ```
  - Requires `ADMIN` role

- **Delete user:**  
  `DELETE /api/admin/users/{id}`
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
  `PATCH /api/manage/users/{id}`  
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
- **Database**: `ex_base_17_backend_python`
- **No authentication required by default**  
  (Configure `MONGODB_URI` for username/password if needed)
- **Collections** are auto-created by MongoDB when first document is inserted.

---

## 📖 API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
  - Browse and test API endpoints interactively
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
  - Clean, readable auto-generated API docs
- **OpenAPI JSON**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)
  - Download/open the full OpenAPI 3.0 schema

---

## 📁 Project Structure Overview

```
backend-python/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application
│   ├── config.py                  # Configuration settings
│   ├── database.py                # MongoDB connection
│   ├── dependencies.py            # Auth dependencies & RBAC
│   ├── models/
│   │   └── user.py                # User model & Role enum
│   ├── schemas/
│   │   ├── auth.py                # Auth request/response schemas
│   │   └── user.py                # User request/response schemas
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                # Authentication routes
│   │   ├── admin.py               # Admin-only routes
│   │   ├── manager.py             # Manager routes
│   │   ├── user.py                # User self-scope routes
│   │   └── health.py              # Health check
│   ├── repositories/
│   │   └── user_repository.py     # User data access layer
│   └── utils/
│       ├── jwt.py                 # JWT token utilities
│       └── password.py            # Password hashing utilities
├── requirements.txt
├── run.py                         # Application entry point
├── .env.example
└── README.md
```

---

## 🎯 Key Features

- ✅ User registration & authentication
- ✅ Secure password hashing (bcrypt)
- ✅ JWT stateless authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Three roles: ADMIN, MANAGER, USER
- ✅ Protected routes with role validation
- ✅ Self-scope resources for USER role
- ✅ Limited resources for MANAGER role
- ✅ Full access for ADMIN role
- ✅ RESTful API
- ✅ FastAPI with async/await
- ✅ MongoDB backend (collections auto-created)
- ✅ Pydantic validation for input
- ✅ Auto-generated API documentation (Swagger/ReDoc)
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

### RBAC Dependency

The `allow_roles` dependency function validates user roles:

```python
from app.dependencies import allow_roles

@router.get("/users")
async def get_users(current_user: dict = Depends(allow_roles("ADMIN"))):
    # Only ADMIN can access
    pass

@router.get("/manage/users")
async def get_limited_users(current_user: dict = Depends(allow_roles("ADMIN", "MANAGER"))):
    # ADMIN or MANAGER can access
    pass
```

---

## 👑 Creating an Admin User

By default, registered users have the `USER` role. To promote an account to `ADMIN`:

1. Register a user via `/api/auth/register`
2. Use your MongoDB shell or GUI:
   ```javascript
   use ex_base_17_backend_python
   db.users.updateOne(
     { username: "YOUR_USERNAME" },
     { $set: { role: "ADMIN" } }
   )
   ```
   Or with mongo shell:
   ```bash
   mongo ex_base_17_backend_python --eval 'db.users.updateOne({username: "YOUR_USERNAME"}, {$set: {role: "ADMIN"}})'
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
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Endpoint (with token)
```bash
curl -X GET http://localhost:8000/api/profile/profile \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### 4. Test Role-Based Access

**As USER trying to access ADMIN endpoint:**
```bash
curl -X GET http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer <USER_TOKEN>"
```
**Expected:** `403 Forbidden`

**As ADMIN accessing ADMIN endpoint:**
```bash
curl -X GET http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
**Expected:** `200 OK` with users list

---

## 🔄 Comparison with Node.js Backend

This Python FastAPI backend provides the same functionality as the Node.js backend:

| Feature | Node.js Backend | Python FastAPI Backend |
|---------|----------------|----------------------|
| Framework | Express | FastAPI |
| Database | Mongoose | Motor (async MongoDB) |
| Authentication | JWT (jsonwebtoken) | JWT (python-jose) |
| Password Hashing | bcryptjs | passlib[bcrypt] |
| RBAC | Middleware (`allowRoles`) | Dependency (`allow_roles`) |
| Port | 3000 | 8000 |
| API Endpoints | Same | Same |
| Async Support | Yes | Yes (native) |

Both backends are functionally equivalent and can be used interchangeably with the frontend.

---

## 📚 Dependencies

- **fastapi** - Modern web framework
- **uvicorn** - ASGI server
- **motor** - Async MongoDB driver
- **python-jose** - JWT authentication
- **passlib** - Password hashing
- **pydantic** - Data validation
- **python-dotenv** - Environment variables

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Verify `MONGODB_URI` in `.env` file
- Check MongoDB connection string format

### JWT Token Invalid
- Ensure token is sent in format: `Bearer <token>`
- Check if token has expired (24 hours by default)
- Verify `JWT_SECRET` matches between token generation and validation

### 403 Forbidden
- Verify user has the required role
- Check if role is assigned in database
- Ensure JWT token contains correct role information

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check Python version (3.10+ required)

---

## 📝 License

ISC

