// src/components/common/Table.jsx
import React, { useState } from 'react';

/**
 * Table component for displaying data in a structured format
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.isLoading - Whether the table is loading
 * @param {string} props.emptyMessage - Message to display when there's no data
 * @param {boolean} props.sortable - Whether the table can be sorted
 * @param {string} props.defaultSortField - Default field to sort by
 * @param {string} props.defaultSortDirection - Default sort direction ('asc' or 'desc')
 * @param {function} props.onRowClick - Function to call when a row is clicked
 * @param {string} props.className - Additional CSS classes
 */
const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "No data available",
  sortable = false,
  defaultSortField = "",
  defaultSortDirection = "asc",
  onRowClick,
  className = "",
}) => {
  // State for sorting
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Function to handle sort
  const handleSort = (field) => {
    // Only sort if sortable is true
    if (!sortable) return;

    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {  
      // If clicking on a different field, set it as the new sort field with default direction
      setSortField(field);
      setSortDirection(defaultSortDirection);
    }
  };

  // Function to sort data
  const sortedData = () => {
    if (!sortable || !sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      
      // Handle different data types (string, number, date)
      if (typeof aValue === "string") {
        console.log(aValue, bValue);
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc" 
          ? aValue - bValue 
          : bValue - aValue;
      }
    });
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (!sortable) return null;
    if (field !== sortField) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 text-brand-green" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 text-brand-green" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  sortable && column.sortable !== false ? 'cursor-pointer' : ''
                } ${column.className || ''}`}
                onClick={() => column.sortable !== false && handleSort(column.field)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable !== false && renderSortIcon(column.field)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData().map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}>
                  {column.render ? column.render(row) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;