// src/pages/AilmentsPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/common/SearchBar";

const AilmentsPage = () => {
  const [expandedCategory, setExpandedCategory] = useState("digestive");

  // Common ailments for quick access
  const commonAilments = [
    "Migraine",
    "High Blood Pressure",
    "Joint Pain",
    "Acid Reflux",
    "Anxiety",
  ];

  // Ailment categories with their remedies
  const ailmentCategories = {
    mens: {
      label: "Men's Health",
      count: 2,
      ailments: [],
    },
    digestive: {
      label: "Digestive Issues",
      count: 3,
      ailments: [
        { name: "Acid Reflux", remediesCount: 12 },
        { name: "IBS", remediesCount: 5 },
        { name: "Constipation", remediesCount: 10 },
      ],
    },
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AI Banner */}
      <div className="bg-brand-green text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <span>🌿 AI-Powered Remedy Recommendations Available!</span>
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content - Matching the structure from RemediesPage */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Header with fixed search bar alignment - Same as RemediesPage */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 md:self-center">Browse Ailments</h1>
            
            <div className="w-full md:w-64 lg:w-80">
              <SearchBar 
                onSearch={handleSearch} 
                className="w-full" 
                placeholder="Search ailments e.g. Migraine"
              />
            </div>
          </div>

          {/* Common Ailments */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Common Ailments</h2>
            <div className="flex flex-wrap gap-3">
              {commonAilments.map((ailment) => (
                <Link
                  key={ailment}
                  to={`/ailments/${ailment.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bg-white rounded-full px-4 py-2 text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  {ailment}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {/* Men's Health Category */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full p-4 flex justify-between items-center bg-white"
                onClick={() => toggleCategory("mens")}
              >
                <div className="text-xl font-medium">
                  Men's Health{" "}
                  <span className="text-gray-500 text-sm ml-2">
                    ({ailmentCategories.mens.count})
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      expandedCategory === "mens"
                        ? "M5 15l7-7 7 7"
                        : "M19 9l-7 7-7-7"
                    }
                  />
                </svg>
              </button>

              {expandedCategory === "mens" && (
                <div className="p-4 bg-white">
                  <p className="text-gray-500">
                    No ailments in this category yet.
                  </p>
                </div>
              )}
            </div>

            {/* Digestive Issues Category */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full p-4 flex justify-between items-center bg-white"
                onClick={() => toggleCategory("digestive")}
              >
                <div className="text-xl font-medium">
                  Digestive Issues{" "}
                  <span className="text-gray-500 text-sm ml-2">
                    ({ailmentCategories.digestive.count})
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      expandedCategory === "digestive"
                        ? "M5 15l7-7 7 7"
                        : "M19 9l-7 7-7-7"
                    }
                  />
                </svg>
              </button>

              {expandedCategory === "digestive" && (
                <div className="divide-y divide-gray-100">
                  {ailmentCategories.digestive.ailments.map((ailment) => (
                    <Link
                      key={ailment.name}
                      to={`/ailments/${ailment.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex justify-between items-center p-4 hover:bg-gray-50"
                    >
                      <div className="text-gray-700">
                        {ailment.name}{" "}
                        <span className="text-gray-500 text-sm ml-2">
                          ({ailment.remediesCount} Remedies)
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-brand-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AilmentsPage;