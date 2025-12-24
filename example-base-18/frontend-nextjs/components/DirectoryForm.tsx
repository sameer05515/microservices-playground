'use client';

import { useState, useEffect } from 'react';
import type { Directory, DirectoryRequest } from '@/types';

interface DirectoryFormProps {
  directory?: Directory;
  parentId?: string;
  onSubmit: (data: DirectoryRequest) => Promise<void>;
  onCancel: () => void;
}

export default function DirectoryForm({ directory, parentId, onSubmit, onCancel }: DirectoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (directory) {
      setName(directory.name);
      setDescription(directory.description || '');
    }
  }, [directory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: DirectoryRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        parentId: directory ? directory.parentId : (parentId || undefined),
      };
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save directory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="Directory name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="Optional description"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : directory ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

