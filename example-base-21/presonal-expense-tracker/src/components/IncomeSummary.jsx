import React from 'react';
import { FaChartPie, FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import {
  formatCurrency,
  calculateTotal,
  calculateCategoryTotals,
  INCOME_CATEGORIES,
  getIncomeCategoryById,
} from '../utils/expenseUtils';
import { exportSummaryToExcel } from '../utils/exportUtils';

const IncomeSummary = ({ incomes, stats }) => {
  const handleExportSummary = () => {
    if (stats) {
      exportSummaryToExcel(stats, 'income_summary', {
        resolveCategory: getIncomeCategoryById,
        totalMetricLabel: 'Total Income',
      });
    } else {
      alert('No summary data available to export');
    }
  };

  const total = stats?.total ?? calculateTotal(incomes);
  const count = incomes.length;

  let categoryTotals = {};
  if (stats?.byCategory && stats.byCategory.length > 0) {
    stats.byCategory.forEach((item) => {
      categoryTotals[item._id] = item.total;
    });
  } else {
    categoryTotals = calculateCategoryTotals(incomes);
  }

  const topCategories = Object.entries(categoryTotals)
    .map(([categoryId, amount]) => ({
      category:
        INCOME_CATEGORIES.find((c) => c.id === categoryId) ||
        INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  let recentMonths = [];
  if (stats?.monthly && stats.monthly.length > 0) {
    recentMonths = stats.monthly.slice(0, 6).map((item) => [
      `${item.year}-${String(item.month).padStart(2, '0')}`,
      item.total,
    ]);
  } else {
    const monthly = incomes.reduce((acc, row) => {
      const d = new Date(row.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + row.amount;
      return acc;
    }, {});
    recentMonths = Object.entries(monthly)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6);
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExportSummary}
            className="btn-secondary flex items-center gap-2 text-sm"
            title="Export summary to Excel"
          >
            <FaFileExcel /> Export Summary
          </button>
        </div>
      )}

      <div className="card bg-gradient-to-br from-emerald-500 to-emerald-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Total Income</p>
            <p className="text-4xl font-bold">{formatCurrency(total)}</p>
            <p className="text-emerald-100 text-sm mt-2">
              {count} {count === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4 flex items-center justify-center">
            <span className="text-3xl font-bold">+</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FaChartPie className="text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Top Categories</h3>
        </div>
        {topCategories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No income yet</p>
        ) : (
          <div className="space-y-3">
            {topCategories.map(({ category, amount }) => {
              const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
              return (
                <div key={category.id} className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({percentage}%)</span>
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

      {recentMonths.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Monthly Breakdown</h3>
          </div>
          <div className="space-y-2">
            {recentMonths.map(([monthKey, amount]) => {
              const [year, month] = monthKey.split('-');
              const monthName = new Date(year, parseInt(month, 10) - 1).toLocaleString('default', {
                month: 'long',
              });
              return (
                <div
                  key={monthKey}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fadeIn"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {monthName} {year}
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
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

export default IncomeSummary;
