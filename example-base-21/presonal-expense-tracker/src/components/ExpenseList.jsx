import React from 'react';
import { FaEdit, FaTrash, FaSearch, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { formatCurrency, formatDate, getCategoryById, CATEGORIES } from '../utils/expenseUtils';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

const ExpenseList = ({ expenses, onEdit, onDelete, filters, onFilterChange, loading }) => {
  const handleCategoryFilter = (e) => {
    onFilterChange({ ...filters, category: e.target.value || null });
  };

  const handleDateFilter = (field, value) => {
    onFilterChange({ ...filters, [field]: value || null });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value || null });
  };

  const clearFilters = () => {
    onFilterChange({
      category: null,
      startDate: null,
      endDate: null,
      search: null,
    });
  };

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate || filters.search;

  const handleExportCSV = () => {
    exportToCSV(expenses, 'expenses');
  };

  const handleExportExcel = () => {
    exportToExcel(expenses, 'expenses');
  };

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Expenses
          </h2>
          {expenses.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Export to CSV"
              >
                <FaFileCsv /> CSV
              </button>
              <button
                onClick={handleExportExcel}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Export to Excel"
              >
                <FaFileExcel /> Excel
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="label">Filter by Category</label>
            <select
              value={filters.category || ''}
              onChange={handleCategoryFilter}
              className="input-field"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleDateFilter('startDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleDateFilter('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary w-full"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Expense List */}
      {loading && expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {hasActiveFilters
              ? 'No expenses match your filters.'
              : 'No expenses yet. Add your first expense to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(expense => {
            const category = getCategoryById(expense.category);
            const expenseId = expense._id || expense.id; // Support both MongoDB _id and local id
            return (
              <div
                key={expenseId}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 animate-fadeIn"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${category.color} px-3 py-1 rounded-full text-lg`}>
                        {category.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {expense.description}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.name} • {formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {formatCurrency(expense.amount)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        aria-label="Edit expense"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(expenseId)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        aria-label="Delete expense"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

