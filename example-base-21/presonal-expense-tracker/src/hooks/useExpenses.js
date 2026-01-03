import { useState, useEffect, useCallback } from 'react';
import { expenseAPI } from '../utils/apiClient';

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch all expenses
  const fetchExpenses = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseAPI.getAll(filters);
      // Handle both array and object with data property
      const expensesArray = Array.isArray(data) ? data : (data.data || []);
      setExpenses(expensesArray);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Failed to fetch expenses');
      setExpenses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async (filters = {}) => {
    try {
      setStatsLoading(true);
      const data = await expenseAPI.getStats(filters);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Don't set error for stats, just log it
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Create expense
  const createExpense = useCallback(async (expenseData) => {
    try {
      const newExpense = await expenseAPI.create(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      console.error('Error creating expense:', err);
      throw err;
    }
  }, []);

  // Update expense
  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const updatedExpense = await expenseAPI.update(id, expenseData);
      setExpenses(prev =>
        prev.map(exp => (exp._id === id || exp.id === id ? updatedExpense : exp))
      );
      return updatedExpense;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseAPI.delete(id);
      setExpenses(prev => prev.filter(exp => (exp._id !== id && exp.id !== id)));
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [fetchExpenses, fetchStats]);

  return {
    expenses,
    loading,
    error,
    stats,
    statsLoading,
    fetchExpenses,
    fetchStats,
    createExpense,
    updateExpense,
    deleteExpense,
    refresh: () => {
      fetchExpenses();
      fetchStats();
    },
  };
};

export default useExpenses;

