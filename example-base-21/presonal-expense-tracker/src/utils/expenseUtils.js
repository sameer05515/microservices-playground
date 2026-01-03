// Expense categories
export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: 'bg-orange-100 dark:bg-orange-900' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 dark:bg-pink-900' },
  { id: 'health', name: 'Health & Fitness', icon: '💊', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'education', name: 'Education', icon: '📚', color: 'bg-indigo-100 dark:bg-indigo-900' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-gray-100 dark:bg-gray-700' },
];

// Get category by ID
export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

// Income categories (must match pet-backend Income model enum)
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary / Wages', icon: '💼', color: 'bg-emerald-100 dark:bg-emerald-900' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: 'bg-teal-100 dark:bg-teal-900' },
  { id: 'business', name: 'Business', icon: '🏢', color: 'bg-cyan-100 dark:bg-cyan-900' },
  { id: 'investment', name: 'Investment', icon: '📈', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'gift', name: 'Gift', icon: '🎁', color: 'bg-pink-100 dark:bg-pink-900' },
  { id: 'refund', name: 'Refund', icon: '↩️', color: 'bg-amber-100 dark:bg-amber-900' },
  { id: 'interest', name: 'Interest', icon: '💹', color: 'bg-lime-100 dark:bg-lime-900' },
  { id: 'rental', name: 'Rental', icon: '🏠', color: 'bg-sky-100 dark:bg-sky-900' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-gray-100 dark:bg-gray-700' },
];

export const getIncomeCategoryById = (id) => {
  return INCOME_CATEGORIES.find((cat) => cat.id === id) || INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Calculate totals by category
export const calculateCategoryTotals = (expenses) => {
  const totals = {};
  expenses.forEach(expense => {
    const categoryId = expense.category;
    totals[categoryId] = (totals[categoryId] || 0) + parseFloat(expense.amount);
  });
  return totals;
};

// Calculate total expenses
export const calculateTotal = (expenses) => {
  return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
};

// Filter expenses
export const filterExpenses = (expenses, filters) => {
  return expenses.filter(expense => {
    // Category filter
    if (filters.category && expense.category !== filters.category) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate) {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(filters.startDate);
      if (expenseDate < startDate) {
        return false;
      }
    }
    
    if (filters.endDate) {
      const expenseDate = new Date(expense.date);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      if (expenseDate > endDate) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesDescription = expense.description?.toLowerCase().includes(searchLower);
      const matchesCategory = getCategoryById(expense.category).name.toLowerCase().includes(searchLower);
      if (!matchesDescription && !matchesCategory) {
        return false;
      }
    }

    
    return true;
  });
};

