'use client';

import { useState } from 'react';
import type { SearchResponse } from '@/types';
import { searchApi } from '@/lib/api';

interface SearchBarProps {
  onResults: (results: SearchResponse) => void;
}

export default function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchApi.search(query);
      onResults(results);
    } catch (error: any) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search directories and topics..."
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

