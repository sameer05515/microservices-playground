import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaChartBar, FaChartPie } from 'react-icons/fa';
import { formatCurrency, CATEGORIES } from '../utils/expenseUtils';

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6b7280', // gray
];

const ExpenseCharts = ({ stats, expenses }) => {
  // Prepare data for charts
  const categoryData = stats?.byCategory
    ? stats.byCategory.map((item) => {
        const category = CATEGORIES.find((cat) => cat.id === item._id) || CATEGORIES[CATEGORIES.length - 1];
        return {
          name: category.name,
          icon: category.icon,
          value: item.total,
          count: item.count,
        };
      })
    : [];

  const monthlyData = stats?.monthly
    ? stats.monthly.slice(0, 6).map((item) => {
        const monthName = new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' });
        return {
          name: `${monthName} ${item.year}`,
          amount: item.total,
          count: item.count,
        };
      })
    : [];

  if (categoryData.length === 0 && monthlyData.length === 0) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No data available for charts. Add some expenses to see visualizations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Pie Chart */}
      {categoryData.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaChartPie className="text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Expenses by Category
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Bar Chart */}
      {categoryData.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Category Comparison
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Trend Chart */}
      {monthlyData.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Monthly Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#10b981" name="Monthly Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ExpenseCharts;

