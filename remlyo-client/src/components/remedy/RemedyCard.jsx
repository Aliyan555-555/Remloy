// src/components/remedy/RemedyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const RemedyCard = ({ 
  id, 
  title, 
  description, 
  image, 
  category,
  aiConfidence,
  className = ''
}) => {
  // Handle image error once to prevent infinite loops
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = `https://via.placeholder.com/300x200?text=${title.replace(/\s+/g, '+')}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        {category && (
          <div className="absolute top-2 left-2 bg-brand-green text-white px-3 py-1 rounded-full text-xs">
            {category}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        
        {aiConfidence && (
          <div className="mt-2 text-sm text-gray-600">
            AI Confidence: {aiConfidence}%
          </div>
        )}
        
        <Link 
          to={`/remedies/${id}`}
          className="mt-3 inline-block bg-brand-green text-white text-sm px-4 py-1 rounded-md hover:bg-brand-green-dark transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default RemedyCard;