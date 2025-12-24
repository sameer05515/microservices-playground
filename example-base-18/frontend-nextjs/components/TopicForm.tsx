'use client';

import { useState, useEffect } from 'react';
import type { Topic, TopicRequest } from '@/types';

interface TopicFormProps {
  topic?: Topic;
  directoryId?: string;
  onSubmit: (data: TopicRequest) => Promise<void>;
  onCancel: () => void;
}

export default function TopicForm({ topic, directoryId, onSubmit, onCancel }: TopicFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setContent(topic.content || '');
    }
  }, [topic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: TopicRequest = {
        title: title.trim(),
        content: content.trim() || undefined,
        directoryId: topic ? topic.directoryId : (directoryId!),
      };
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save topic');
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
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          placeholder="Topic title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content <span className="text-gray-500 text-xs">(Markdown supported)</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 font-mono text-sm"
          placeholder="Topic content (optional) - Markdown supported with code blocks"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supports Markdown syntax including code blocks with syntax highlighting
        </p>
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
          {loading ? 'Saving...' : topic ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

