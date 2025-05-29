// src/pages/ExtendedHealthProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const ExtendedHealthProfile = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCount, setSelectedCount] = useState(2);
  const [expandedSections, setExpandedSections] = useState({
    lifestyle: true,
    dietary: false,
    environmental: false,
    health: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleNext = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AI Banner */}


      {/* Navigation */}


      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-[#f3f4fa] py-8">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4">
          <div className="flex justify-center pt-8">
            <img src="/images/Remlyo Logo.png" alt="Remlyo" className="h-10" />
          </div>
          
          <div className="text-center mt-6 mb-8 px-6">
            <h1 className="text-2xl font-semibold text-brand-green">Dive Deeper with AI – Share More, Get Better Remedies!</h1>
            <p className="mt-2 text-gray-600">
              Optional AI-Driven Questions (50+ Dynamic Fields)<br />
              Take your time, enhance wellness with personalized remedies every step!
            </p>
          </div>
          
          {/* Scrollable Form Content */}
          <div className="px-8 py-6 overflow-y-auto max-h-[60vh]">
            {/* Lifestyle Habits Section */}
            <div className="mb-6 border border-gray-200 rounded-lg">
              <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('lifestyle')}>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Lifestyle Habits</h2>
                  <p className="text-gray-600">Share more about your lifestyle habits for smarter remedies!</p>
                </div>
                <button className="text-gray-500 text-2xl">
                  {expandedSections.lifestyle ? '−' : '+'}
                </button>
              </div>
              
              {expandedSections.lifestyle && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Much Water Do You Drink Daily?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select your intake</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Do You Smoke?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select your habit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often Do You Drink Alcohol?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Stressed Are You?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select level</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Much Caffeine Do You Have?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Do You Own a Pet?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select option</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Many Hours Outdoors Daily?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dietary Habits Section */}
            <div className="mb-6 border border-gray-200 rounded-lg">
              <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('dietary')}>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Dietary Habits</h2>
                  <p className="text-gray-600">Share more about your dietary habits for smarter remedies!</p>
                </div>
                <button className="text-gray-500 text-2xl">
                  {expandedSections.dietary ? '−' : '+'}
                </button>
              </div>
              
              {expandedSections.dietary && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Much Sugar Do You Consume?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select level</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Much Salt Do You Use?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select level</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often Do You Eat Fast Food?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often Do You Eat Organic?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Much Fiber Daily?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often Do You Eat Red Meat?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often Do You Eat Dairy?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Which Cooking Oils Do You Use?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select oils</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Are You Vegetarian/Vegan?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select option</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Do You Have Gluten Issues?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select option</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Environmental Exposure Section */}
            <div className="mb-6 border border-gray-200 rounded-lg">
              <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('environmental')}>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Environmental Exposure</h2>
                  <p className="text-gray-600">Share more about your exposure to environmental pollutants for smarter remedies!</p>
                </div>
                <button className="text-gray-500 text-2xl">
                  {expandedSections.environmental ? '−' : '+'}
                </button>
              </div>
              
              {expandedSections.environmental && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exposed to Pollutants?
                      </label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green" placeholder="Enter details" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What's Your Work Environment?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select type</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Where Do You Live?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select area</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Noise Pollution Around You?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select option</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exposed to Harmful Substances?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Enter details</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Health Monitoring Section */}
            <div className="mb-6 border border-gray-200 rounded-lg">
              <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('health')}>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Health Monitoring</h2>
                  <p className="text-gray-600">Share more about your frequency of doctor visits for smarter remedies!</p>
                </div>
                <button className="text-gray-500 text-2xl">
                  {expandedSections.health ? '−' : '+'}
                </button>
              </div>
              
              {expandedSections.health && (
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often See Doctor?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How Often See Dentist?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select frequency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Use Health Devices?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select option</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Had Recent Blood Tests?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select option</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What's Your Vaccination Status?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select status</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Which Vaccine Do You Have?
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option disabled selected value="">Select Vaccine</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="border-t border-gray-200 px-8 py-4 flex justify-between items-center">
            <div className="text-gray-600">
              {selectedCount} of 2 selected
            </div>
            <div className="flex space-x-4">
              <Button
                variant="contained"
                color="brand"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal - Show when finish button clicked */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-end">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Health Profile</h2>
              <p className="text-gray-600">Let's add one detail to personalize your remedies!</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How Much Sugar Do You Consume?
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green mb-4">
                <option disabled selected>Select level</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button onClick={goToDashboard} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                Skip
              </button>
              <button onClick={goToDashboard} className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
                Prefer Not to Say
              </button>
              <button onClick={goToDashboard} className="bg-brand-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Disable Prompts
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ExtendedHealthProfile;