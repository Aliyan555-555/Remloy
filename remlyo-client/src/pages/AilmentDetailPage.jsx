// src/pages/AilmentDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Import Tab Components
import CommunityRemediesTab from "../components/ailment/CommunityRemediesTab";
import AlternativeRemediesTab from "../components/ailment/AlternativeRemediesTab";
import PharmaceuticalRemediesTab from "../components/ailment/PharmaceuticalRemediesTab";
import AIRemediesTab from "../components/ailment/AIRemediesTab";
import { useAuth } from "../contexts/AuthContext";
import { getAilmentBySlug } from "./../api/ailmentsApi";

const AilmentDetailPage = () => {
  const { ailmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken } = useAuth();

  // Initialize state
  const [activeTab, setActiveTab] = useState("community");
  const [ailmentData, setAilmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Extract tab from URL or set default
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["community", "alternative", "pharmaceutical", "ai"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const fetchAilment = async () => {
    const res = await getAilmentBySlug(authToken, ailmentId, activeTab);
    if (res.success) {
      setAilmentData(res.ailment);
      setIsLoading(false);
    }
  };

  // Fetch ailment data based on ailmentId
  useEffect(() => {
    // Simulating API call
    fetchAilment();
  }, [ailmentId]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", tab);
    navigate(`/ailments/${ailmentId}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);
  };

  

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-brand-green text-white py-2 text-center">
          <div className="container mx-auto px-4">
            <span>🌿 AI-Powered Remedy Recommendations Available!</span>
          </div>
        </div>
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
        <Footer />
      </div>
    );
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

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Ailment Title and Description - CENTERED */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {ailmentData.name}
            </h1>
            <p className="text-gray-600 max-w-4xl mx-auto">
              {ailmentData.description}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => handleTabChange("community")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "community"
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Community Remedies
            </button>
            <button
              onClick={() => handleTabChange("alternative")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "alternative"
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Alternative Remedies
            </button>
            <button
              onClick={() => handleTabChange("pharmaceutical")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "pharmaceutical"
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Pharmaceutical Remedies
            </button>
            <button
              onClick={() => handleTabChange("ai")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "ai"
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              AI Remedies
            </button>
          </div>

          {/* Sort Controls - No Search Bar */}
          <div className="flex justify-end mb-6">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                Sort By
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isSortDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                  <ul className="">
                    <li
                      className={`${
                        sortOption === "newest" && "bg-gray-200"
                      } px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm`}
                      onClick={() => handleSortChange("newest")}
                    >
                      Newest
                    </li>
                    <li
                      className={`${
                        sortOption === "rating" && "bg-gray-200"
                      } px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm`}
                      onClick={() => handleSortChange("rating")}
                    >
                      High to low rating
                    </li>

                    <li
                      className={`${
                        sortOption === "effective" && "bg-gray-200"
                      } px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm`}
                      onClick={() => handleSortChange("effective")}
                    >
                      Most effective
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Display message when specific tab selected */}
          {activeTab === "pharmaceutical" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Always consult with a healthcare professional before
                    starting any medication
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content Based on Active Tab */}
          <div>
            {activeTab === "community" && (
              <CommunityRemediesTab
                ailmentId={ailmentData._id}
                sortOption={sortOption}
                activeTab={activeTab}
              />
            )}
            {activeTab === "alternative" && (
              <AlternativeRemediesTab
                ailmentId={ailmentData._id}
                sortOption={sortOption}
                activeTab={activeTab}
              />
            )}
            {activeTab === "pharmaceutical" && (
              <PharmaceuticalRemediesTab
                ailmentId={ailmentData._id}
                sortOption={sortOption}
                activeTab={activeTab}
              />
            )}
            {activeTab === "ai" && (
              <AIRemediesTab
                ailmentId={ailmentData._id}
                sortOption={sortOption}
                activeTab={activeTab}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AilmentDetailPage;
