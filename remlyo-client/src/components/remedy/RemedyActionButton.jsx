// src/components/remedy/RemedyActionButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RemedyActionButton = ({ to, type, children, className = '' }) => {
  // Map type to appropriate styling
  let typeClass = "bg-brand-green"; // Default
  
  // Different styling based on remedy type
  switch(type) {
    case "community":
      typeClass = "bg-blue-500";
      break;
    case "alternative":
      typeClass = "bg-purple-500";
      break;
    case "ai":
      typeClass = "bg-yellow-500";
      break;
    case "pharmaceutical":
      typeClass = "bg-green-500";
      break;
    default:
      typeClass = "bg-brand-green";
  }
  
  return (
    <Link 
      to={to} 
      className={`
        ${typeClass} 
        text-white 
        text-center 
        w-full 
        flex 
        items-center 
        justify-center 
        rounded-md 
        px-4 
        py-2 
        text-sm 
        font-medium 
        transition-colors 
        hover:opacity-90
        truncate
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default RemedyActionButton;