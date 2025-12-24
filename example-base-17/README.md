# Example Base 17 - RBAC Backend (Node.js)

This example demonstrates a **Role-Based Access Control (RBAC)** implementation using Node.js, Express, MongoDB, and JWT authentication.

---

## 📋 User Story

**As an authenticated user, I want access to only those API endpoints that match my role (Admin, Manager, User), so that unauthorized operations are automatically blocked.**

---

## ✅ Acceptance Criteria

- ✅ Users must have a role assigned after login
- ✅ Each protected route must validate role before processing
- ✅ Unauthorized access → return HTTP 403
- ✅ Admin can access all resources
- ✅ Manager can read/update limited resources
- ✅ User can only access self-scope resources

---

## 🎯 Gherkin Test Scenarios

```gherkin
Given a logged-in user with role "User"
When they call /admin or /manage endpoint
Then response should be 403 Forbidden

And when Admin calls the same endpoint
Then response should be 200 OK
```

---

## 🚀 Quick Start

### Prerequisites
- **For Node.js Backend:** Node.js 18+, npm or yarn
- **For Spring Boot Backend:** Java 21+, Maven 3.6+
- **For Python Backend:** Python 3.10+, pip
- MongoDB 6+ (running locally or remotely)

### Backend Setup (Choose One)

#### Option 1: Node.js Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your MongoDB URI and JWT secret.

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

The Node.js backend will start on `http://localhost:3000`

#### Option 2: Spring Boot Backend

1. **Navigate to backend-spring-boot directory:**
   ```bash
   cd backend-spring-boot
   ```

2. **Configure MongoDB in `application.properties`:**
   ```
   spring.data.mongodb.uri=mongodb://localhost:27017/ex_base_17_backend_spring
   jwt.secret=your_super_secret_jwt_key
   ```

3. **Start the backend server:**
   ```bash
   mvn spring-boot:run
   ```

The Spring Boot backend will start on `http://localhost:8080`

#### Option 3: Python FastAPI Backend

1. **Navigate to backend-python directory:**
   ```bash
   cd backend-python
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your MongoDB URI and JWT secret.

5. **Start the backend server:**
   ```bash
   python run.py
   ```

The Python backend will start on `http://localhost:8000`

> **Note:** All three backends provide the same API endpoints and RBAC functionality. Choose based on your preference (Node.js, Java/Spring Boot, or Python/FastAPI).

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:3000`

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000` (Next.js default). If port 3000 is taken, Next.js will use 3001.

> **Note:** Make sure the backend is running before starting the frontend!

---

## 📁 Project Structure

```
example-base-17/
├── backend/                      # Node.js Backend (Express)
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT auth & RBAC middleware
│   ├── models/
│   │   └── User.js              # User model with role
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── admin.js             # Admin-only routes
│   │   ├── manager.js           # Manager routes
│   │   ├── user.js              # User self-scope routes
│   │   └── health.js            # Health check
│   ├── utils/
│   │   └── jwt.js               # JWT token generation
│   ├── package.json
│   ├── server.js                # Main application file
│   └── README.md                # Detailed backend documentation
│
├── backend-spring-boot/          # Spring Boot Backend (Java)
│   ├── src/main/java/com/p/backend/
│   │   ├── config/              # Security, OpenAPI config
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # Data transfer objects
│   │   ├── entity/              # MongoDB entities
│   │   ├── repository/          # Spring Data repositories
│   │   ├── security/            # JWT & RBAC security
│   │   └── service/             # Business logic
│   ├── pom.xml
│   └── README.md                # Spring Boot documentation
│
├── backend-python/               # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # MongoDB connection
│   │   ├── dependencies.py      # Auth & RBAC dependencies
│   │   ├── models/              # Pydantic models
│   │   ├── schemas/             # Request/response schemas
│   │   ├── routers/             # API routes
│   │   ├── repositories/        # Data access layer
│   │   └── utils/               # Utilities (JWT, password)
│   ├── requirements.txt
│   ├── run.py
│   └── README.md                # Python documentation
│
└── frontend-nextjs/              # Next.js Frontend
    ├── app/                      # Next.js App Router pages
    │   ├── dashboard/           # Role-based dashboards
    │   ├── login/               # Login page
    │   ├── register/            # Registration page
    │   └── unauthorized/        # 403 Forbidden page
    ├── components/              # React components
    ├── context/                 # React context (Auth)
    ├── lib/                     # API service layer
    ├── package.json
    └── README.md                # Frontend documentation
```

---

## 🔐 Roles & Permissions

### ADMIN
- Full system access
- Can manage all users (CRUD)
- Can change user roles
- Access: `/api/admin/*`

### MANAGER
- Limited resource access
- Can read/update USER accounts only
- Cannot modify ADMIN or MANAGER accounts
- Access: `/api/manage/*`

### USER
- Self-scope access only
- Can access and modify own profile
- Cannot access other users' data
- Access: `/api/profile/*`

---

## 🧪 Testing Examples

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test RBAC - User accessing Admin endpoint (should fail)
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <USER_TOKEN>"
```
**Expected:** `403 Forbidden`

### 4. Test RBAC - Admin accessing Admin endpoint (should succeed)
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
**Expected:** `200 OK` with users list

---

## 📚 API Endpoints

### Public
- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Protected (require JWT)
- `GET /api/auth/me` - Get current user
- `GET /api/profile/profile` - Get own profile (any user)
- `PATCH /api/profile/profile` - Update own profile (any user)
- `PATCH /api/profile/password` - Change own password (any user)
- `GET /api/profile/dashboard` - User dashboard (any user)

### Admin Only
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/dashboard` - Admin dashboard

### Manager (Admin or Manager)
- `GET /api/manage/users` - Get limited users list
- `PATCH /api/manage/users/:id` - Update user (USER only)
- `GET /api/manage/dashboard` - Manager dashboard

---

## 🔑 RBAC Middleware

The RBAC middleware validates user roles before processing requests:

```javascript
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: User role not found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
```

### Usage
```javascript
// Admin only
app.get('/admin', authenticate, allowRoles('ADMIN'), handler);

// Admin or Manager
app.get('/manage', authenticate, allowRoles('ADMIN', 'MANAGER'), handler);

// All authenticated users
app.get('/profile', authenticate, handler);
```

---

## 📖 Documentation

- **Node.js Backend:** See [backend/README.md](backend/README.md) for detailed API documentation
- **Spring Boot Backend:** See [backend-spring-boot/README.md](backend-spring-boot/README.md) for Spring Boot documentation
- **Python Backend:** See [backend-python/README.md](backend-python/README.md) for Python/FastAPI documentation
- **Frontend:** See [frontend-nextjs/README.md](frontend-nextjs/README.md) for frontend documentation

> **Note:** All three backends are functionally equivalent:
> - Node.js backend runs on port **3000**
> - Spring Boot backend runs on port **8080**
> - Python FastAPI backend runs on port **8000**
> 
> Update the frontend's `NEXT_PUBLIC_API_URL` accordingly based on which backend you choose to run.

---

## 🎯 Key Features

- ✅ JWT-based authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Three roles: ADMIN, MANAGER, USER
- ✅ Protected routes with role validation
- ✅ Self-scope resources for USER role
- ✅ Limited resources for MANAGER role
- ✅ Full access for ADMIN role
- ✅ MongoDB backend
- ✅ Secure password hashing (bcryptjs)
- ✅ RESTful API design

---

## 📝 License

ISC

