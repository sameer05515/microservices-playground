import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { INCOME_CATEGORIES } from '../utils/expenseUtils';

const DEFAULT_CATEGORY = 'salary';

const IncomeForm = ({ income, onSave, onCancel, isOpen, saving }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: DEFAULT_CATEGORY,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (income) {
      setFormData({
        description: income.description || '',
        amount: income.amount || '',
        category: income.category || DEFAULT_CATEGORY,
        date: income.date ? income.date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: DEFAULT_CATEGORY,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [income, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    const payload = {
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: new Date(formData.date).toISOString(),
    };

    if (income && (income._id || income.id)) {
      payload.id = income._id || income.id;
    }

    onSave(payload);
    setFormData({
      description: '',
      amount: '',
      category: DEFAULT_CATEGORY,
      date: new Date().toISOString().split('T')[0],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full animate-slideDown">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {income ? 'Edit Income' : 'Add Income'}
          </h2>
          <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="income-description" className="label">Description *</label>
            <input
              type="text"
              id="income-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Monthly salary"
              required
            />
          </div>

          <div>
            <label htmlFor="income-amount" className="label">Amount (INR) *</label>
            <input
              type="number"
              id="income-amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="income-category" className="label">Category *</label>
            <select
              id="income-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              {INCOME_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="income-date" className="label">Date *</label>
            <input
              type="date"
              id="income-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={saving}
            >
              <FaSave /> {saving ? 'Saving...' : income ? 'Update' : 'Add'} Income
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;
