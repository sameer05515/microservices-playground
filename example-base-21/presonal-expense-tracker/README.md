# Personal Expense Tracker 📊

A modern, feature-rich React.js application for tracking and managing personal expenses with a beautiful, responsive UI.

## Features

✨ **Core Functionality**
- ➕ Add, edit, and delete **expenses** and **income** (tabs in the UI)
- 📝 Track description, amount, category, and date for each entry
- 🌐 Backend API integration with MongoDB (`/api/expenses`, `/api/incomes`)
- 🔍 Search and filter per tab
- 📊 Summary and statistics from API (including income stats)
- ⚡ Real-time data synchronization

🎨 **User Experience**
- 🌓 Dark mode support
- 📱 Fully responsive design
- 🎯 Intuitive and modern UI
- ⚡ Smooth animations and transitions
- 🎨 Category-based color coding

📈 **Analytics**
- Total expenses calculation
- Top categories breakdown with percentages
- Monthly expense breakdown
- Visual progress bars for category spending

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (running locally or remotely)
- Backend server running (see Backend Setup below)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd ../pet-backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your MongoDB URI:
   ```env
   MONGODB_URI=mongodb://localhost:27017/personal-expense-tracker
   PORT=3001
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd presonal-expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if your backend is on a different URL:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

```
presonal-expense-tracker/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ExpenseForm.jsx      # Form for adding/editing expenses
│   │   ├── ExpenseList.jsx      # List view with filtering
│   │   └── ExpenseSummary.jsx   # Summary cards and statistics
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Custom hook for localStorage (dark mode)
│   │   └── useExpenses.js       # Custom hook for API data management
│   ├── utils/
│   │   ├── expenseUtils.js      # Utility functions
│   │   └── apiClient.js         # API client for backend communication
│   ├── App.js                   # Main application component
│   ├── index.js                 # Entry point
│   └── index.css                # Global styles with Tailwind
├── .env.example                 # Environment variables template
├── package.json
├── tailwind.config.js
└── README.md
```

## Usage

### Adding an Expense

1. Click the floating **+** button (bottom right)
2. Fill in the expense details:
   - Description (required)
   - Amount in USD (required)
   - Category (required)
   - Date (required)
3. Click "Add Expense"

### Editing an Expense

1. Click the **✏️ Edit** icon on any expense
2. Modify the details
3. Click "Update Expense"

### Deleting an Expense

1. Click the **🗑️ Delete** icon on any expense
2. Confirm the deletion

### Filtering Expenses

- **Search**: Type in the search box to filter by description or category
- **Category Filter**: Select a category from the dropdown
- **Date Range**: Set start and end dates to filter by date range
- **Clear Filters**: Click "Clear All Filters" to reset

### Dark Mode

Click the moon/sun icon in the header to toggle between light and dark themes.

## Expense Categories

- 🍔 Food & Dining
- 🚗 Transport
- 🎬 Entertainment
- 💡 Bills & Utilities
- 🛍️ Shopping
- 💊 Health & Fitness
- 📚 Education
- 📦 Other

## Technologies Used

- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls
- **Backend API** - Node.js/Express with MongoDB

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Backend Integration

The frontend is now integrated with a RESTful backend API:

- ✅ **MongoDB Database** - All expenses are stored in MongoDB
- ✅ **RESTful API** - Full CRUD operations via HTTP endpoints
- ✅ **Real-time Sync** - Changes are immediately reflected
- ✅ **Statistics API** - Summary data fetched from backend
- ✅ **Error Handling** - Graceful error messages and retry functionality
- ✅ **Loading States** - Visual feedback during API calls

### API Endpoints Used

- `GET /api/expenses` - Fetch all expenses (with filtering)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/summary` - Get statistics

See the backend README (`../pet-backend/README.md`) for complete API documentation.

## Future Enhancements

Potential features for future versions:
- 📤 Export expenses to CSV/JSON
- 📥 Import expenses from file
- 📊 Advanced charts and graphs
- 💱 Multi-currency support
- 📅 Budget planning and alerts
- 🔄 Data sync across devices
- 📧 Email reports

## License

This project is open source and available for personal and educational use.

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

**Happy Expense Tracking! 💰**

