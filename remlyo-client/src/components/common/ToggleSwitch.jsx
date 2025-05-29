// src/components/common/ToggleSwitch.jsx
import React from 'react';

/**
 * ToggleSwitch component for boolean settings
 * @param {Object} props
 * @param {boolean} props.isOn - Whether the toggle is on
 * @param {function} props.onToggle - Function to call when toggle is clicked
 * @param {boolean} props.disabled - Whether the toggle is disabled
 * @param {string} props.size - Toggle size ('sm', 'md', 'lg')
 * @param {string} props.onColor - Color when toggle is on
 * @param {string} props.offColor - Color when toggle is off
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.label - Optional label for the toggle
 * @param {string} props.labelPosition - Position of the label ('left', 'right')
 */
const ToggleSwitch = ({
  isOn = false,
  onToggle,
  disabled = false,
  size = 'md',
  onColor = 'bg-brand-green',
  offColor = 'bg-gray-300',
  className = '',
  label,
  labelPosition = 'right',
  id,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      toggle: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
      padding: 'p-0.5',
    },
    md: {
      toggle: 'w-12 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-6',
      padding: 'p-0.5',
    },
    lg: {
      toggle: 'w-16 h-8',
      circle: 'w-6 h-6',
      translate: 'translate-x-8',
      padding: 'p-1',
    },
  };

  // Get size configuration
  const config = sizeConfig[size] || sizeConfig.md;

  // Generate a unique ID for accessibility if not provided
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  // Create the toggle component
  const toggle = (
    <div
      id={toggleId}
      role="switch"
      aria-checked={isOn}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onToggle}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex ${config.toggle} ${config.padding} ${
        isOn ? onColor : offColor
      } rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <span
        className={`${
          isOn ? config.translate : 'translate-x-0'
        } inline-block ${
          config.circle
        } bg-white rounded-full transform transition ease-in-out duration-200`}
      />
    </div>
  );

  // If no label, just return the toggle
  if (!label) {
    return toggle;
  }

  // Return toggle with label
  return (
    <div className="flex items-center">
      {labelPosition === 'left' && (
        <span className="mr-3 text-sm text-gray-700">{label}</span>
      )}
      {toggle}
      {labelPosition === 'right' && (
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      )}
    </div>
  );
};

export default ToggleSwitch;