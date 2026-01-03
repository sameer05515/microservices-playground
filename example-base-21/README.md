# Example Base 21 - Personal Expense Tracker

A full-stack Personal Expense Tracker application with React frontend and Node.js/Express backend.

## 🏗️ Architecture

```
example-base-21/
├── pet-backend/              # Node.js/Express REST API
│   ├── MongoDB Database
│   ├── JWT Authentication (optional)
│   └── RESTful API endpoints
│
└── presonal-expense-tracker/ # React Frontend
    ├── React 18
    ├── Tailwind CSS
    └── Axios for API calls
```

## 🚀 Quick Start

### 1. Start Backend

```bash
cd pet-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Start Frontend

```bash
cd presonal-expense-tracker
npm install
cp .env.example .env
# Edit .env if backend URL is different
npm start
```

Frontend runs on `http://localhost:3000`

## 📋 Features

### Frontend
- ✅ Modern React UI with Tailwind CSS
- ✅ Dark mode support
- ✅ Real-time expense tracking
- ✅ Advanced filtering and search
- ✅ Statistics and analytics
- ✅ Responsive design

### Backend
- ✅ RESTful API with Express
- ✅ MongoDB database
- ✅ CRUD operations
- ✅ Statistics endpoints
- ✅ Optional JWT authentication
- ✅ Error handling and validation

## 📚 Documentation

- **Frontend**: See `presonal-expense-tracker/README.md`
- **Backend**: See `pet-backend/README.md`

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/personal-expense-tracker
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🎯 Usage

1. Start MongoDB (if running locally)
2. Start the backend server
3. Start the frontend application
4. Open browser to `http://localhost:3000`
5. Start adding your expenses!

## 📝 Notes

- The backend supports both authenticated and unauthenticated access
- All data is persisted in MongoDB
- The frontend automatically syncs with the backend
- Error messages are displayed if the backend is unavailable

---

**Happy Expense Tracking! 💰**

