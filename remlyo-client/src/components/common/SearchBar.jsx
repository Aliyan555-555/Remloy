// src/components/common/SearchBar.jsx
import React, { useState } from "react";

const SearchBar = ({ onSearch, className = "", placeholder }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <input
        type="text"
        placeholder={
          placeholder || "Search remedies or describe your symptoms..."
        }
        className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-green"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-green"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
