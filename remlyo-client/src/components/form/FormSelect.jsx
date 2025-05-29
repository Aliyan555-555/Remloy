// src/components/form/FormSelect.jsx
import React from "react";

const FormSelect = ({
  label,
  name,
  placeholder = "Select an option",
  value,
  onChange,
  required = false,
  className = "",
  options,
  error,
  multiple=false
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label}{" "}
        {error && <span className="text-sm text-red-600">({error})</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          multiple={multiple?multiple:false}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`appearance-none w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green bg-white ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {/* Options will be passed as children */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
