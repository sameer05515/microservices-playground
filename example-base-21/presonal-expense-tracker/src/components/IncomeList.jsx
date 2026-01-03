import React from 'react';
import { FaEdit, FaTrash, FaSearch, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
  formatCurrency,
  formatDate,
  getIncomeCategoryById,
  INCOME_CATEGORIES,
} from '../utils/expenseUtils';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

const IncomeList = ({ incomes, onEdit, onDelete, filters, onFilterChange, loading }) => {
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
    exportToCSV(incomes, 'incomes', getIncomeCategoryById);
  };

  const handleExportExcel = () => {
    exportToExcel(incomes, 'incomes', getIncomeCategoryById, 'Incomes');
  };

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Income</h2>
          {incomes.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Export to CSV"
              >
                <FaFileCsv /> CSV
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Export to Excel"
              >
                <FaFileExcel /> Excel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
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

          <div>
            <label className="label">Filter by Category</label>
            <select
              value={filters.category || ''}
              onChange={handleCategoryFilter}
              className="input-field"
            >
              <option value="">All Categories</option>
              {INCOME_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

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

          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="btn-secondary w-full">
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {loading && incomes.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading income...</p>
        </div>
      ) : incomes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {hasActiveFilters
              ? 'No income matches your filters.'
              : 'No income yet. Add your first income entry!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {incomes.map((row) => {
            const category = getIncomeCategoryById(row.category);
            const rowId = row._id || row.id;
            return (
              <div
                key={rowId}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 animate-fadeIn border-l-4 border-emerald-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${category.color} px-3 py-1 rounded-full text-lg`}>
                        {category.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {row.description}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.name} • {formatDate(row.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                      +{formatCurrency(row.amount)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        aria-label="Edit income"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(rowId)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        aria-label="Delete income"
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

export default IncomeList;
