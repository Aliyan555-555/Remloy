// src/pages/AilmentsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/common/SearchBar";
import { getAllAilmentsCategoryWise } from "../api/ailmentsApi";
import LoadingSpinner from "./../components/common/LoadingSpinner";

const AilmentsPage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commonAilments, setCommonAilments] = useState([]);
  const [ailmentCategories, setAilmentCategories] = useState([]);

  const fetchAilments = async () => {
    try {
      const res = await getAllAilmentsCategoryWise();
      if (res.success) {
        setAilmentCategories(res.categories);
        setExpandedCategory(res.categories[0].name);
        setCommonAilments(res.commonAilments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchAilments();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

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
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 md:self-center">
              Browse Ailments
            </h1>

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
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Common Ailments
            </h2>
            <div className="flex flex-wrap gap-3">
              {commonAilments.map((ailment) => (
                <Link
                  key={ailment._id}
                  to={`/ailments/${ailment.slug}`}
                  className="bg-white rounded-full px-4 py-2 text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  {ailment.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {/* Men's Health Category */}
            {ailmentCategories.map((category) => (
              <div
                key={category.name}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full p-4 flex justify-between items-center bg-white"
                  onClick={() => toggleCategory(category.name)}
                >
                  <div className="text-xl font-medium">
                    {category.name}
                    <span className="text-gray-500 text-sm ml-2">
                      ({category.ailments.length})
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
                        expandedCategory === category.name
                          ? "M5 15l7-7 7 7"
                          : "M19 9l-7 7-7-7"
                      }
                    />
                  </svg>
                </button>

                {expandedCategory === category.name && (
                  <div className="p-4 bg-white">
                    {category.ailments.map((ailment) => (
                      <Link
                        key={ailment.name}
                        to={`/ailments/${ailment.slug}`}
                        className="flex justify-between items-center p-4 hover:bg-gray-50"
                      >
                        <div className="text-gray-700">
                          {ailment.name}{" "}
                          <span className="text-gray-500 text-sm ml-2">
                            ({ailment.totalRemediesNo} Remedies)
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
            ))}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AilmentsPage;
