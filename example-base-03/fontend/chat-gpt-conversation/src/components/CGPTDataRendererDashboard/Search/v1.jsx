import React, { useState, memo, useCallback } from 'react';

const Search = memo(({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(searchQuery);
  }, [onSearch, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button 
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors"
        >
          Search
        </button>
      </div>
    </div>
  );
});

Search.displayName = "Search";

export default Search;
