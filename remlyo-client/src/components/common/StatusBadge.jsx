// src/components/common/StatusBadge.jsx
import React from 'react';

/**
 * StatusBadge component for displaying status indicators
 * @param {Object} props
 * @param {string} props.status - Status value ('approved', 'rejected', 'pending', 'suspended', etc.)
 * @param {Object} props.customColors - Custom color overrides for statuses
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Badge size ('sm', 'md', 'lg')
 */
const StatusBadge = ({
  status,
  customColors = {},
  className = '',
  size = 'md',
}) => {
  // Default colors for different statuses
  const defaultColors = {
    // Success statuses
    approved: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    published: 'bg-green-100 text-green-800',
    complete: 'bg-green-100 text-green-800',
    verified: 'bg-green-100 text-green-800',
    success: 'bg-green-100 text-green-800',
    
    // Pending/warning statuses
    pending: 'bg-yellow-100 text-yellow-800',
    inProgress: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-yellow-100 text-yellow-800',
    review: 'bg-yellow-100 text-yellow-800',
    warning: 'bg-yellow-100 text-yellow-800',
    
    // Error/danger statuses
    rejected: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
    blocked: 'bg-red-100 text-red-800',
    error: 'bg-red-100 text-red-800',
    suspended: 'bg-red-100 text-red-800',
    
    // Info/neutral statuses
    draft: 'bg-blue-100 text-blue-800',
    moderation: 'bg-blue-100 text-blue-800',
    info: 'bg-blue-100 text-blue-800',
    
    // Default for unknown status
    default: 'bg-gray-100 text-gray-800',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  // Normalize status to lowercase and remove spaces
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '') || 'default';
  
  // Get color classes for the status (use custom if provided, else default)
  const colorClasses = customColors[normalizedStatus] || defaultColors[normalizedStatus] || defaultColors.default;
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClasses} ${sizeClasses[size]} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;