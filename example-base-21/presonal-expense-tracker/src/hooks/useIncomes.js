import { useState, useEffect, useCallback } from 'react';
import { incomeAPI } from '../utils/apiClient';

const useIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchIncomes = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await incomeAPI.getAll(filters);
      const list = Array.isArray(data) ? data : data.data || [];
      setIncomes(list);
    } catch (err) {
      console.error('Error fetching incomes:', err);
      setError(err.message || 'Failed to fetch incomes');
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIncomeStats = useCallback(async (filters = {}) => {
    try {
      setStatsLoading(true);
      const data = await incomeAPI.getStats(filters);
      setStats(data);
    } catch (err) {
      console.error('Error fetching income stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const createIncome = useCallback(async (payload) => {
    try {
      const created = await incomeAPI.create(payload);
      setIncomes((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error creating income:', err);
      throw err;
    }
  }, []);

  const updateIncome = useCallback(async (id, payload) => {
    try {
      const updated = await incomeAPI.update(id, payload);
      setIncomes((prev) =>
        prev.map((row) => (row._id === id || row.id === id ? updated : row))
      );
      return updated;
    } catch (err) {
      console.error('Error updating income:', err);
      throw err;
    }
  }, []);

  const deleteIncome = useCallback(async (id) => {
    try {
      await incomeAPI.delete(id);
      setIncomes((prev) => prev.filter((row) => row._id !== id && row.id !== id));
    } catch (err) {
      console.error('Error deleting income:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
    fetchIncomeStats();
  }, [fetchIncomes, fetchIncomeStats]);

  return {
    incomes,
    loading,
    error,
    stats,
    statsLoading,
    fetchIncomes,
    fetchIncomeStats,
    createIncome,
    updateIncome,
    deleteIncome,
    refresh: () => {
      fetchIncomes();
      fetchIncomeStats();
    },
  };
};

export default useIncomes;
