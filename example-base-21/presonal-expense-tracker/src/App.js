import React, { useState, useEffect } from 'react';
import { FaPlus, FaMoon, FaSun, FaTrashAlt, FaExclamationTriangle, FaChartBar, FaWallet, FaArrowDown } from 'react-icons/fa';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseCharts from './components/ExpenseCharts';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import IncomeSummary from './components/IncomeSummary';
import IncomeCharts from './components/IncomeCharts';
import useLocalStorage from './hooks/useLocalStorage';
import useExpenses from './hooks/useExpenses';
import useIncomes from './hooks/useIncomes';

function App() {
  const {
    expenses,
    loading,
    error,
    stats,
    statsLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchExpenses,
    fetchStats,
  } = useExpenses();

  const {
    incomes,
    loading: incomeLoading,
    error: incomeError,
    stats: incomeStats,
    // statsLoading: incomeStatsLoading,
    createIncome,
    updateIncome,
    deleteIncome,
    fetchIncomes,
    fetchIncomeStats,
  } = useIncomes();

  const [mainTab, setMainTab] = useState('expenses');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [expenseFilters, setExpenseFilters] = useState({
    category: null,
    startDate: null,
    endDate: null,
    search: null,
  });
  const [incomeFilters, setIncomeFilters] = useState({
    category: null,
    startDate: null,
    endDate: null,
    search: null,
  });

  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mainTab === 'expenses') {
        fetchExpenses(expenseFilters);
        fetchStats({
          startDate: expenseFilters.startDate,
          endDate: expenseFilters.endDate,
        });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [mainTab, expenseFilters, fetchExpenses, fetchStats]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mainTab === 'income') {
        fetchIncomes(incomeFilters);
        fetchIncomeStats({
          startDate: incomeFilters.startDate,
          endDate: incomeFilters.endDate,
        });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [mainTab, incomeFilters, fetchIncomes, fetchIncomeStats]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddClick = () => {
    if (mainTab === 'expenses') {
      setEditingExpense(null);
    } else {
      setEditingIncome(null);
    }
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleEditIncome = (row) => {
    setEditingIncome(row);
    setIsFormOpen(true);
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      setSaving(true);
      const expenseId = expenseData.id || expenseData._id;
      if (expenseId) {
        await updateExpense(expenseId, expenseData);
      } else {
        await createExpense(expenseData);
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      fetchStats({
        startDate: expenseFilters.startDate,
        endDate: expenseFilters.endDate,
      });
    } catch (err) {
      alert(`Failed to save expense: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIncome = async (payload) => {
    try {
      setSaving(true);
      const id = payload.id || payload._id;
      const body = { ...payload };
      delete body.id;
      delete body._id;
      if (id) {
        await updateIncome(id, body);
      } else {
        await createIncome(body);
      }
      setIsFormOpen(false);
      setEditingIncome(null);
      fetchIncomeStats({
        startDate: incomeFilters.startDate,
        endDate: incomeFilters.endDate,
      });
    } catch (err) {
      alert(`Failed to save income: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    setEditingIncome(null);
  };

  const handleDeleteExpense = async (id) => {
    if (deleteConfirm === id || window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        setDeleteConfirm(null);
        fetchStats({
          startDate: expenseFilters.startDate,
          endDate: expenseFilters.endDate,
        });
      } catch (err) {
        alert(`Failed to delete expense: ${err.message}`);
      }
    }
  };

  const handleDeleteIncome = async (id) => {
    if (deleteConfirm === id || window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await deleteIncome(id);
        setDeleteConfirm(null);
        fetchIncomeStats({
          startDate: incomeFilters.startDate,
          endDate: incomeFilters.endDate,
        });
      } catch (err) {
        alert(`Failed to delete income: ${err.message}`);
      }
    }
  };

  const handleClearAllExpenses = async () => {
    if (window.confirm('Delete ALL expenses? This cannot be undone.')) {
      try {
        await Promise.all(
          expenses.map((exp) =>
            deleteExpense(exp._id || exp.id).catch((err) => {
              console.error(err);
              return null;
            })
          )
        );
        fetchStats();
      } catch (err) {
        alert(`Failed to clear expenses: ${err.message}`);
      }
    }
  };

  const handleClearAllIncomes = async () => {
    if (window.confirm('Delete ALL income entries? This cannot be undone.')) {
      try {
        await Promise.all(
          incomes.map((row) =>
            deleteIncome(row._id || row.id).catch((err) => {
              console.error(err);
              return null;
            })
          )
        );
        fetchIncomeStats();
      } catch (err) {
        alert(`Failed to clear income: ${err.message}`);
      }
    }
  };

  const activeError = mainTab === 'expenses' ? error : incomeError;
  const activeLoading = mainTab === 'expenses' ? loading : incomeLoading;
  const activeList = mainTab === 'expenses' ? expenses : incomes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                Personal Expense Tracker
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => {
                    setMainTab('expenses');
                    setIsFormOpen(false);
                    setEditingExpense(null);
                    setEditingIncome(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                    mainTab === 'expenses'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <FaArrowDown /> Expenses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMainTab('income');
                    setIsFormOpen(false);
                    setEditingExpense(null);
                    setEditingIncome(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                    mainTab === 'income'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <FaWallet /> Income
                </button>
              </div>
              {mainTab === 'expenses' && expenses.length > 0 && !loading && (
                <button type="button" onClick={handleClearAllExpenses} className="btn-danger flex items-center gap-2">
                  <FaTrashAlt /> Clear All
                </button>
              )}
              {mainTab === 'income' && incomes.length > 0 && !incomeLoading && (
                <button type="button" onClick={handleClearAllIncomes} className="btn-danger flex items-center gap-2">
                  <FaTrashAlt /> Clear All
                </button>
              )}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeError && (
          <div className="mb-6 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle />
            <span>{activeError}</span>
            <button
              type="button"
              onClick={() =>
                mainTab === 'expenses'
                  ? fetchExpenses(expenseFilters)
                  : fetchIncomes(incomeFilters)
              }
              className="ml-auto text-sm underline"
            >
              Retry
            </button>
          </div>
        )}

        {activeLoading && activeList.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading {mainTab === 'expenses' ? 'expenses' : 'income'}...
            </p>
          </div>
        )}

        {(!activeLoading || activeList.length > 0) && mainTab === 'expenses' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <ExpenseSummary expenses={expenses} stats={stats} loading={statsLoading} />
              </div>
              <div className="lg:col-span-2">
                <ExpenseList
                  expenses={expenses}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                  filters={expenseFilters}
                  onFilterChange={setExpenseFilters}
                  loading={loading}
                />
              </div>
            </div>
            {expenses.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FaChartBar /> Visual Analytics
                  </h2>
                  <button type="button" onClick={() => setShowCharts(!showCharts)} className="btn-secondary text-sm">
                    {showCharts ? 'Hide Charts' : 'Show Charts'}
                  </button>
                </div>
                {showCharts && <ExpenseCharts stats={stats} expenses={expenses} />}
              </div>
            )}
          </>
        )}

        {(!activeLoading || activeList.length > 0) && mainTab === 'income' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <IncomeSummary incomes={incomes} stats={incomeStats} />
              </div>
              <div className="lg:col-span-2">
                <IncomeList
                  incomes={incomes}
                  onEdit={handleEditIncome}
                  onDelete={handleDeleteIncome}
                  filters={incomeFilters}
                  onFilterChange={setIncomeFilters}
                  loading={incomeLoading}
                />
              </div>
            </div>
            {incomes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FaChartBar /> Income Analytics
                  </h2>
                  <button type="button" onClick={() => setShowCharts(!showCharts)} className="btn-secondary text-sm">
                    {showCharts ? 'Hide Charts' : 'Show Charts'}
                  </button>
                </div>
                {showCharts && <IncomeCharts stats={incomeStats} />}
              </div>
            )}
          </>
        )}
      </main>

      <button
        type="button"
        onClick={handleAddClick}
        className={`fixed bottom-8 right-8 text-white rounded-full p-4 shadow-lg z-30 ${
          mainTab === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary-600 hover:bg-primary-700'
        }`}
        aria-label={mainTab === 'expenses' ? 'Add expense' : 'Add income'}
      >
        <FaPlus size={24} />
      </button>

      {mainTab === 'expenses' && (
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={handleCancelForm}
          isOpen={isFormOpen && mainTab === 'expenses'}
          saving={saving}
        />
      )}
      {mainTab === 'income' && (
        <IncomeForm
          income={editingIncome}
          onSave={handleSaveIncome}
          onCancel={handleCancelForm}
          isOpen={isFormOpen && mainTab === 'income'}
          saving={saving}
        />
      )}
    </div>
  );
}

export default App;
