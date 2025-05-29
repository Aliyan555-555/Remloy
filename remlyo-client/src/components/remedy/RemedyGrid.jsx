// src/components/remedy/RemedyGrid.jsx
import React from 'react';
import RemedyCard from './RemedyCard';
import Pagination from '../common/Pagination';

const RemedyGrid = ({ 
  remedies, 
  category, 
  currentPage, 
  totalPages,
  onPageChange 
}) => {
  if (!remedies || remedies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No remedies found for this category.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Remedies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {remedies.map((remedy) => (
          <RemedyCard 
            key={remedy.id} 
            remedy={remedy} 
            category={category}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RemedyGrid;