import * as XLSX from 'xlsx';
import { formatDate, getCategoryById } from './expenseUtils';

/**
 * Export transactions to CSV (expenses or incomes)
 * @param {Array} items - Array of expense/income objects
 * @param {string} filename - Name of the file (without extension)
 * @param {(id: string) => { name: string }} resolveCategory - maps category id to display
 */
export const exportToCSV = (items, filename = 'expenses', resolveCategory = getCategoryById) => {
  if (!items || items.length === 0) {
    alert('Nothing to export');
    return;
  }

  const headers = ['Date', 'Description', 'Category', 'Amount (₹)'];
  const rows = items.map((row) => {
    const category = resolveCategory(row.category);
    return [
      formatDate(row.date),
      row.description,
      category.name,
      row.amount,
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export transactions to Excel
 */
export const exportToExcel = (
  items,
  filename = 'expenses',
  resolveCategory = getCategoryById,
  sheetName = 'Expenses'
) => {
  if (!items || items.length === 0) {
    alert('Nothing to export');
    return;
  }

  const data = items.map((row) => {
    const category = resolveCategory(row.category);
    return {
      Date: formatDate(row.date),
      Description: row.description,
      Category: category.name,
      'Amount (₹)': row.amount,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // Date
    { wch: 30 }, // Description
    { wch: 20 }, // Category
    { wch: 15 }, // Amount
  ];
  worksheet['!cols'] = colWidths;

  // Generate Excel file and download
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Export summary stats to Excel (expense or income)
 * @param {Object} options.resolveCategory - category id → { name }
 * @param {string} options.totalMetricLabel - e.g. "Total Expenses" or "Total Income"
 */
export const exportSummaryToExcel = (
  stats,
  filename = 'expense_summary',
  options = {}
) => {
  if (!stats) {
    alert('No summary data to export');
    return;
  }

  const {
    resolveCategory = getCategoryById,
    totalMetricLabel = 'Total Expenses',
  } = options;

  const workbook = XLSX.utils.book_new();

  const summaryData = [
    { Metric: totalMetricLabel, Value: stats.total || 0 },
    { Metric: 'Total Count', Value: stats.count || 0 },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  if (stats.byCategory && stats.byCategory.length > 0) {
    const categoryData = stats.byCategory.map((item) => {
      const category = resolveCategory(item._id);
      return {
        Category: category.name,
        'Total Amount (₹)': item.total,
        Count: item.count,
      };
    });
    const categorySheet = XLSX.utils.json_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');
  }

  // Monthly breakdown sheet
  if (stats.monthly && stats.monthly.length > 0) {
    const monthlyData = stats.monthly.map((item) => {
      const monthName = new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' });
      return {
        Month: `${monthName} ${item.year}`,
        'Total Amount (₹)': item.total,
        Count: item.count,
      };
    });
    const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly');
  }

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

