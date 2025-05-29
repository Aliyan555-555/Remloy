// src/components/form/FormLayout.jsx
import React from 'react';
import Button from '../common/Button';


const FormLayout = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  showBackButton = true 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4fa] py-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <div className="flex justify-center pt-8">
          <img src="/images/Remlyo Logo.png" alt="Remlyo" className="h-10" />
        </div>
        
        <div className="text-center mt-6 mb-8 px-6">
          <h1 className="text-2xl font-semibold text-brand-green">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          )}
        </div>
        
        <div className="px-8 py-6">
          {children}
        </div>
        
        <div className="border-t border-gray-200 px-8 py-4 flex justify-between items-center">
          <div className="text-gray-600">
            {currentStep} of {totalSteps} selected
          </div>
          <div className="flex space-x-4">
            {showBackButton && currentStep > 1 && (
              <Button
                variant="outlined"
                color="brand"
                onClick={onBack}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="brand"
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;