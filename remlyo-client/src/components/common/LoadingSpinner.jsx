import React from "react";

const LoadingSpinner = ({ heightClass = "min-h-screen" }) => {
  return (
    <div className={`flex items-center justify-center ${heightClass}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
    </div>
  );
};

export default LoadingSpinner;
