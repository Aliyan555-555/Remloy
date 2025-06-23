// src/components/common/Button.jsx
import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  className = "",
  to,
  href,
  onClick,
  type = "button",
  size = "medium",
  color = "brand",
  fullWidth = false,
  disabled = false,
}) => {
  // Base button styles
  let buttonClass =
    "inline-flex items-center justify-center rounded-full font-medium transition-all";

  // Size variants
  const sizeClasses = {
    small: "text-sm px-4 py-1.5",
    medium: "text-base px-6 py-2",
    large: "text-lg px-8 py-3",
  };

  // Variant styles
  switch (variant) {
    case "contained":
      buttonClass += ` ${
        color === "brand"
          ? "bg-brand-green text-white"
          : "bg-blue-500 text-white"
      } shadow-md hover:shadow-lg active:shadow-sm`;
      break;
    case "outlined":
      buttonClass += ` border-2 ${
        color === "brand"
          ? "border-brand-green text-brand-green"
          : "border-blue-500 text-blue-500"
      } bg-transparent hover:bg-opacity-10 hover:${
        color === "brand" ? "bg-brand-green" : "bg-blue-500"
      }`;
      break;
    case "text":
      buttonClass += ` ${
        color === "brand" ? "text-brand-green" : "text-blue-500"
      } bg-transparent hover:bg-gray-100`;
      break;
    case "explore":
      buttonClass +=
        " bg-brand-green text-white shadow-md hover:shadow-lg active:shadow-sm";
      break;
    case "readMore":
      buttonClass +=
        " bg-brand-green text-white shadow-sm text-sm px-4 py-1.5 hover:shadow-md";
      break;
    default:
      buttonClass += " bg-brand-green text-white shadow-md hover:shadow-lg";
  }

  // Add size class
  buttonClass += ` ${sizeClasses[size] || sizeClasses.medium}`;

  // Add fullWidth if needed
  if (fullWidth) {
    buttonClass += " w-full";
  }

  // Combine with any additional classes
  const allClasses = `${buttonClass} ${className}`;

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={allClasses}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={allClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button disabled={disabled} type={type} className={allClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
