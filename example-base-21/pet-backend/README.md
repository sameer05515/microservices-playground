# Personal Expense Tracker Backend API

A RESTful API backend for the Personal Expense Tracker application built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete expenses and **incomes**
- ✅ **Authentication** - JWT-based user authentication (optional)
- ✅ **Filtering & Search** - Filter by category, date range, and search by description
- ✅ **Statistics** - Get expense summaries, category totals, and monthly breakdowns
- ✅ **Pagination** - Efficient data retrieval with pagination support
- ✅ **Data Validation** - Comprehensive input validation
- ✅ **Error Handling** - Proper error responses and status codes
- ✅ **CORS Support** - Configured for frontend integration

## 📋 Prerequisites

- **Node.js 18+** and npm
- **MongoDB 6+** (running locally or remotely)
- **Port 3001** available (configurable)

## ⚙️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd pet-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration:**
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/personal-expense-tracker
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

## 📝 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "<JWT_TOKEN>"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "<JWT_TOKEN>"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

### Expense Endpoints

#### Get All Expenses
```http
GET /api/expenses?category=food&startDate=2024-01-01&endDate=2024-12-31&search=grocery&page=1&limit=10
Authorization: Bearer <JWT_TOKEN>  # Optional
```

**Query Parameters:**
- `category` - Filter by category (food, transport, entertainment, bills, shopping, health, education, other)
- `startDate` - Filter expenses from this date (YYYY-MM-DD)
- `endDate` - Filter expenses until this date (YYYY-MM-DD)
- `search` - Search in description (case-insensitive)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "...",
      "description": "Grocery shopping",
      "amount": 150.50,
      "category": "food",
      "date": "2024-01-15T00:00:00.000Z",
      "userId": "...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Single Expense
```http
GET /api/expenses/:id
Authorization: Bearer <JWT_TOKEN>  # Optional
```

#### Create Expense
```http
POST /api/expenses
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # Optional

{
  "description": "Grocery shopping",
  "amount": 150.50,
  "category": "food",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "_id": "...",
    "description": "Grocery shopping",
    "amount": 150.50,
    "category": "food",
    "date": "2024-01-15T00:00:00.000Z",
    "userId": "...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # Optional

{
  "description": "Updated description",
  "amount": 200.00,
  "category": "shopping",
  "date": "2024-01-16"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <JWT_TOKEN>  # Optional
```

### Income Endpoints

Same patterns as expenses; base path **`/api/incomes`**.

#### Create Income
```http
POST /api/incomes
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # Optional

{
  "description": "Monthly salary",
  "amount": 5000.00,
  "category": "salary",
  "date": "2024-01-15"
}
```

**Income categories:** `salary`, `freelance`, `business`, `investment`, `gift`, `refund`, `interest`, `rental`, `other`

#### Other income routes
- `GET /api/incomes` — list (query: `category`, `startDate`, `endDate`, `search`, `page`, `limit`)
- `GET /api/incomes/stats/summary` — totals, by category, monthly (same query dates as expenses)
- `GET /api/incomes/:id` — single record
- `PUT /api/incomes/:id` — update
- `DELETE /api/incomes/:id` — delete

#### Get Expense Statistics
```http
GET /api/expenses/stats/summary?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <JWT_TOKEN>  # Optional
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5000.00,
    "count": 50,
    "byCategory": [
      {
        "_id": "food",
        "total": 2000.00,
        "count": 20
      },
      {
        "_id": "transport",
        "total": 1500.00,
        "count": 15
      }
    ],
    "monthly": [
      {
        "year": 2024,
        "month": 1,
        "total": 1000.00,
        "count": 10
      }
    ]
  }
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": "Connected",
  "environment": "development"
}
```

## 🔐 Authentication

Authentication is **optional** for backward compatibility. The API supports both:

1. **Unauthenticated Access** - All expenses are accessible to everyone
2. **Authenticated Access** - Users can only access their own expenses

To use authentication:
1. Register/Login to get a JWT token
2. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 📊 Income Categories

- `salary` - Salary / wages
- `freelance` - Freelance / contract
- `business` - Business income
- `investment` - Investments / dividends
- `gift` - Gifts received
- `refund` - Refunds
- `interest` - Interest earned
- `rental` - Rental income
- `other` - Other

## 📊 Expense Categories

- `food` - Food & Dining
- `transport` - Transport
- `entertainment` - Entertainment
- `bills` - Bills & Utilities
- `shopping` - Shopping
- `health` - Health & Fitness
- `education` - Education
- `other` - Other

## 🛠️ Project Structure

```
pet-backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Expense.js           # Expense model
│   ├── Income.js            # Income model
│   └── User.js              # User model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── expenses.js          # Expense CRUD routes
│   ├── incomes.js           # Income CRUD routes
│   └── health.js            # Health check route
├── utils/
│   └── generateToken.js     # JWT token generation
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main application file
└── README.md
```

## 🧪 Testing with cURL

### Create Income
```bash
curl -X POST http://localhost:3001/api/incomes \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Monthly salary",
    "amount": 5000,
    "category": "salary",
    "date": "2024-01-15"
  }'
```

### Create an Expense
```bash
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Lunch",
    "amount": 25.50,
    "category": "food",
    "date": "2024-01-15"
  }'
```

### Get All Expenses
```bash
curl http://localhost:3001/api/expenses
```

### Get Expenses by Category
```bash
curl "http://localhost:3001/api/expenses?category=food"
```

### Update an Expense
```bash
curl -X PUT http://localhost:3001/api/expenses/<expense_id> \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 30.00
  }'
```

### Delete an Expense
```bash
curl -X DELETE http://localhost:3001/api/expenses/<expense_id>
```

## 🐛 Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for production
- Validate and sanitize all inputs
- Use environment variables for sensitive data

## 📝 Notes

- MongoDB collections are created automatically
- No manual database setup required
- The API supports both authenticated and unauthenticated access
- When authenticated, users can only access their own expenses and incomes
- Date filtering is inclusive of the end date

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Set a strong `JWT_SECRET`
4. Configure CORS for your frontend domain
5. Use a process manager like PM2
6. Set up reverse proxy (nginx) if needed

## 📄 License

ISC

---

**Happy Coding! 💰**

