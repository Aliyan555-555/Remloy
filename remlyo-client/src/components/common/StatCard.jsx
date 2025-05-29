// src/components/common/StatCard.jsx
import React from 'react';

/**
 * StatCard component for displaying metric statistics
 * @param {Object} props
 * @param {string} props.title - The title of the stat card
 * @param {string|number} props.value - The main value to display
 * @param {string} props.subtitle - Optional subtitle text
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {string} props.trend - Optional trend indicator ('up', 'down', 'neutral')
 * @param {string|number} props.trendValue - Optional trend value (e.g., '5%')
 * @param {string} props.trendPeriod - Optional trend period (e.g., 'this month')
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler for the card
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  trendPeriod,
  loading = false,
  className = '',
  onClick,
}) => {
  // Trend colors and icons
  const trendConfig = {
    up: {
      colorClass: 'text-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
    },
    down: {
      colorClass: 'text-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
    },
    neutral: {
      colorClass: 'text-gray-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      ),
    },
  };

  // Get trend display settings
  const trendDisplay = trend ? trendConfig[trend] : null;

  return (
    <div 
      className={`bg-white p-5 rounded-lg shadow-sm border border-gray-200 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>
          
          {loading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded mb-2"></div>
          ) : (
            <div className="flex items-end flex-wrap">
              <div className="text-3xl font-bold text-gray-900 mr-2">{value}</div>
              {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
            </div>
          )}
          
          {/* Trend indicator */}
          {(trend || trendValue || trendPeriod) && (
            <div className="flex items-center mt-2">
              {trendDisplay && (
                <span className={`flex items-center ${trendDisplay.colorClass} mr-1 text-sm`}>
                  {trendDisplay.icon}
                  {trendValue && <span className="ml-1">{trendValue}</span>}
                </span>
              )}
              {trendPeriod && <span className="text-xs text-gray-500">{trendPeriod}</span>}
            </div>
          )}
        </div>
        
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;