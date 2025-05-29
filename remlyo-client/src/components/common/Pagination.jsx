// src/components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxDisplayedPages = 5 
}) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    let pages = [];
    
    if (totalPages <= maxDisplayedPages) {
      // If total pages is less than max to display, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - Math.floor(maxDisplayedPages / 2));
      let end = Math.min(totalPages - 1, start + maxDisplayedPages - 3);
      
      // Adjust start if end is maxed out
      if (end === totalPages - 1) {
        start = Math.max(2, end - maxDisplayedPages + 3);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? 'bg-brand-green text-white font-medium'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      ))}
    </div>
  );
};

export default Pagination;