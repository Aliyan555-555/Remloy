// src/components/common/ActionButtonGroup.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ActionButtonGroup component for table row actions like view, edit, delete
 * @param {Object} props
 * @param {string} props.viewUrl - URL for the view action
 * @param {string} props.editUrl - URL for the edit action
 * @param {function} props.onDelete - Function to call when delete button is clicked
 * @param {function} props.onView - Function to call when view button is clicked (alternative to viewUrl)
 * @param {function} props.onEdit - Function to call when edit button is clicked (alternative to editUrl)
 * @param {Object} props.item - The data item associated with this action group
 * @param {boolean} props.showView - Whether to show the view button
 * @param {boolean} props.showEdit - Whether to show the edit button
 * @param {boolean} props.showDelete - Whether to show the delete button
 * @param {Array} props.extraActions - Array of additional action objects
 * @param {string} props.size - Size of the buttons ('sm', 'md', 'lg')
 * @param {string} props.layout - Layout of the buttons ('row', 'column', 'grid')
 * @param {string} props.className - Additional CSS classes
 */
const ActionButtonGroup = ({
  viewUrl,
  editUrl,
  onDelete,
  onView,
  onEdit,
  item,
  showView = true,
  showEdit = true,
  showDelete = true,
  extraActions = [],
  size = 'md',
  layout = 'row',
  className = '',
}) => {
  // Size classes for the buttons
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-8 w-8',
  };

  // Layout classes
  const layoutClasses = {
    row: 'flex items-center space-x-2',
    column: 'flex flex-col space-y-2',
    grid: 'grid grid-cols-2 gap-2',
  };

  // Function to render the view button
  const renderViewButton = () => {
    if (!showView) return null;

    const button = (
      <button
        className="text-gray-500 hover:text-brand-green"
        title="View"
        onClick={onView ? () => onView(item) : undefined}
        aria-label="View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>
    );

    // If viewUrl is provided, wrap in Link
    if (viewUrl && !onView) {
      return (
        <Link to={viewUrl} className="text-gray-500 hover:text-brand-green" title="View">
          {button}
        </Link>
      );
    }

    return button;
  };

  // Function to render the edit button
  const renderEditButton = () => {
    if (!showEdit) return null;

    const button = (
      <button
        className="text-gray-500 hover:text-brand-green"
        title="Edit"
        onClick={onEdit ? () => onEdit(item) : undefined}
        aria-label="Edit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    );

    // If editUrl is provided, wrap in Link
    if (editUrl && !onEdit) {
      return (
        <Link to={editUrl} className="text-gray-500 hover:text-brand-green" title="Edit">
          {button}
        </Link>
      );
    }

    return button;
  };

  // Function to render the delete button
  const renderDeleteButton = () => {
    if (!showDelete || !onDelete) return null;

    return (
      <button
        className="text-gray-500 hover:text-red-500"
        title="Delete"
        onClick={onDelete ? () => onDelete(item) : undefined}
        aria-label="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    );
  };

  // Function to render extra actions
  const renderExtraActions = () => {
    if (!extraActions || extraActions.length === 0) return null;

    return extraActions.map((action, index) => {
      const Button = (
        <button
          key={index}
          className={action.className || "text-gray-500 hover:text-brand-green"}
          title={action.title}
          onClick={() => action.onClick(item)}
          aria-label={action.title}
        >
          {action.icon}
        </button>
      );

      // If url is provided, wrap in Link
      if (action.url) {
        return (
          <Link 
            key={index}
            to={action.url} 
            className={action.className || "text-gray-500 hover:text-brand-green"} 
            title={action.title}
          >
            {action.icon}
          </Link>
        );
      }

      return Button;
    });
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {renderViewButton()}
      {renderEditButton()}
      {renderDeleteButton()}
      {renderExtraActions()}
    </div>
  );
};

export default ActionButtonGroup;