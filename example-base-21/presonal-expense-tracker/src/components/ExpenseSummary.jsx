import React from 'react';
import { FaChartPie, FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import { formatCurrency, calculateTotal, calculateCategoryTotals, CATEGORIES } from '../utils/expenseUtils';
import { exportSummaryToExcel } from '../utils/exportUtils';

const ExpenseSummary = ({ expenses, stats, loading }) => {
  const handleExportSummary = () => {
    if (stats) {
      exportSummaryToExcel(stats, 'expense_summary');
    } else {
      alert('No summary data available to export');
    }
  };
  // Use stats from API if available, otherwise calculate from expenses
  const total = stats?.total ?? calculateTotal(expenses);
  const expenseCount = expenses.length;
  
  // Get category totals from stats or calculate from expenses
  let categoryTotals = {};
  if (stats?.byCategory && stats.byCategory.length > 0) {
    stats.byCategory.forEach(item => {
      categoryTotals[item._id] = item.total;
    });
  } else {
    categoryTotals = calculateCategoryTotals(expenses);
  }
  
  // Get top 5 categories
  const topCategories = Object.entries(categoryTotals)
    .map(([categoryId, amount]) => ({
      category: CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[CATEGORIES.length - 1],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Get monthly breakdown from stats or calculate from expenses
  let recentMonths = [];
  if (stats?.monthly && stats.monthly.length > 0) {
    recentMonths = stats.monthly.slice(0, 6).map(item => [
      `${item.year}-${String(item.month).padStart(2, '0')}`,
      item.total
    ]);
  } else {
    const monthlyExpenses = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
      return acc;
    }, {});
    recentMonths = Object.entries(monthlyExpenses)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6);
  }

  return (
    <div className="space-y-6">
      {/* Export Button */}
      {stats && (
        <div className="flex justify-end">
          <button
            onClick={handleExportSummary}
            className="btn-secondary flex items-center gap-2 text-sm"
            title="Export summary to Excel"
          >
            <FaFileExcel /> Export Summary
          </button>
        </div>
      )}

      {/* Total Summary Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Total Expenses</p>
            <p className="text-4xl font-bold">{formatCurrency(total)}</p>
            <p className="text-primary-100 text-sm mt-2">
              {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4 flex items-center justify-center">
            <span className="text-3xl font-bold">₹</span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FaChartPie className="text-primary-600" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Top Categories
          </h3>
        </div>
        {topCategories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No expenses yet
          </p>
        ) : (
          <div className="space-y-3">
            {topCategories.map(({ category, amount }) => {
              const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
              return (
                <div key={category.id} className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Breakdown */}
      {recentMonths.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Monthly Breakdown
            </h3>
          </div>
          <div className="space-y-2">
            {recentMonths.map(([monthKey, amount]) => {
              const [year, month] = monthKey.split('-');
              const monthName = new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long' });
              return (
                <div
                  key={monthKey}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fadeIn"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {monthName} {year}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatCurrency(amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;

