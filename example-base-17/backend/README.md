# Backend - Example Base 17 (Node.js, Express, MongoDB, JWT, RBAC)

This is the backend component of **Example Base 17** — a Node.js REST API with Role-Based Access Control (RBAC) using Express, MongoDB, and JWT authentication.

---

## 🚀 Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **MongoDB 6+** running locally or remotely
- **Port 3000** available

---

## ⚙️ Configuration

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   MONGODB_URI=mongodb://localhost:27017/ex_base_17_backend
   ```

> **Tip:** No manual collection/table creation is necessary. Mongoose creates collections automatically as needed.

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ Running the Backend

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

---

## 📝 API Overview

### 🟢 Public Endpoints

#### Health Check
- **GET** `/api/health`
  - Returns server status

#### Register
- **POST** `/api/auth/register`
  ```json
  {
    "username": "jane_doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "USER"  // Optional: USER, MANAGER, ADMIN (default: USER)
  }
  ```
  Response:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "...",
      "username": "jane_doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "token": "<JWT_TOKEN>"
  }
  ```

#### Login
- **POST** `/api/auth/login`
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "...",
      "username": "jane_doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "token": "<JWT_TOKEN>"
  }
  ```

---

### 🔒 Protected Endpoints (**Require JWT Authorization**)

**All protected endpoints require the HTTP header:**  
`Authorization: Bearer <JWT_TOKEN>`

---

### 👑 Admin Endpoints (`/api/admin/*`)

**Requires:** `ADMIN` role

- **GET** `/api/admin/users` - Get all users
- **GET** `/api/admin/users/:id` - Get user by ID
- **PATCH** `/api/admin/users/:id/role` - Update user role
  ```json
  {
    "role": "MANAGER"
  }
  ```
- **DELETE** `/api/admin/users/:id` - Delete user
- **GET** `/api/admin/dashboard` - Admin dashboard

**Access:** Full system access - can manage all users and resources.

---

### 👔 Manager Endpoints (`/api/manage/*`)

**Requires:** `ADMIN` or `MANAGER` role

- **GET** `/api/manage/users` - Get limited users list (USER role only)
- **PATCH** `/api/manage/users/:id` - Update user (USER role only)
  ```json
  {
    "username": "new_username",
    "email": "new@example.com"
  }
  ```
- **GET** `/api/manage/dashboard` - Manager dashboard

**Access:** Limited resource access - can read/update USER accounts only. Cannot modify ADMIN or MANAGER accounts.

---

### 👤 User Endpoints (`/api/profile/*`)

**Requires:** Any authenticated user (self-scope)

- **GET** `/api/profile/profile` - Get own profile
- **PATCH** `/api/profile/profile` - Update own profile
  ```json
  {
    "username": "new_username",
    "email": "new@example.com"
  }
  ```
- **PATCH** `/api/profile/password` - Change own password
  ```json
  {
    "currentPassword": "oldpass",
    "newPassword": "newpass"
  }
  ```
- **GET** `/api/profile/dashboard` - User dashboard

**Access:** Self-scope resources only - can only access and modify their own data.

---

## 🎯 RBAC Implementation

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

### RBAC Middleware

The RBAC middleware (`allowRoles`) validates user roles before processing requests:

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

### Usage Examples

```javascript
// Admin only
app.get('/admin', authenticate, allowRoles('ADMIN'), handler);

// Admin or Manager
app.get('/manage', authenticate, allowRoles('ADMIN', 'MANAGER'), handler);

// All authenticated users
app.get('/profile', authenticate, handler);
```

---

## 🧪 Testing the API

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

### 3. Access Protected Endpoint (with token)
```bash
curl -X GET http://localhost:3000/api/profile/profile \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### 4. Test Role-Based Access

**As USER trying to access ADMIN endpoint:**
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <USER_TOKEN>"
```
**Expected:** `403 Forbidden`

**As ADMIN accessing ADMIN endpoint:**
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
**Expected:** `200 OK` with users list

---

## 👑 Creating an Admin User

### Method 1: Register with role (if allowed in your setup)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

### Method 2: Update role in MongoDB
1. Register a user via `/api/auth/register`
2. Use MongoDB shell or GUI:
   ```javascript
   use ex_base_17_backend
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "ADMIN" } }
   )
   ```

### Method 3: Use Admin endpoint (if you already have an admin)
```bash
curl -X PATCH http://localhost:3000/api/admin/users/<USER_ID>/role \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

---

## 🔑 Using JWT Tokens

1. **Login** to obtain a JWT via `/api/auth/login`
2. **Authenticate** requests by sending:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Role-based endpoints** require both a valid token AND the appropriate role.

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT auth & RBAC middleware
├── models/
│   └── User.js              # User model with role
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin-only routes
│   ├── manager.js           # Manager routes
│   ├── user.js              # User self-scope routes
│   └── health.js            # Health check
├── utils/
│   └── jwt.js               # JWT token generation
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main application file
└── README.md
```

---

## 🎯 Key Features

- ✅ User registration & authentication
- ✅ Secure password hashing (bcryptjs)
- ✅ JWT stateless authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Three roles: ADMIN, MANAGER, USER
- ✅ Protected routes with role validation
- ✅ Self-scope resources for USER role
- ✅ Limited resources for MANAGER role
- ✅ Full access for ADMIN role
- ✅ RESTful API
- ✅ MongoDB backend (collections auto-created)
- ✅ Error handling middleware
- ✅ CORS enabled

---

## 🧪 Gherkin Test Scenarios

### Scenario 1: User accessing Admin endpoint
```
Given a logged-in user with role "USER"
When they call GET /api/admin/users
Then response should be 403 Forbidden
```

### Scenario 2: Admin accessing Admin endpoint
```
Given a logged-in user with role "ADMIN"
When they call GET /api/admin/users
Then response should be 200 OK
And response should contain users list
```

### Scenario 3: Manager accessing Manager endpoint
```
Given a logged-in user with role "MANAGER"
When they call GET /api/manage/users
Then response should be 200 OK
And response should contain only USER role accounts
```

### Scenario 4: Manager trying to update Admin account
```
Given a logged-in user with role "MANAGER"
When they call PATCH /api/manage/users/<ADMIN_ID>
Then response should be 403 Forbidden
And message should be "Cannot update admin or manager accounts"
```

---

## 🔒 Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed using bcryptjs (salt rounds: 10)
- Role validation happens at middleware level
- All protected routes require valid JWT token
- User roles are assigned during registration (default: USER)
- Users must have a role assigned to access protected endpoints

---

## 📚 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Verify `MONGODB_URI` in `.env` file
- Check MongoDB connection string format

### JWT Token Invalid
- Ensure token is sent in format: `Bearer <token>`
- Check if token has expired (24 hours)
- Verify `JWT_SECRET` matches between token generation and validation

### 403 Forbidden
- Verify user has the required role
- Check if role is assigned in database
- Ensure JWT token contains correct role information

---

## 📝 License

ISC

