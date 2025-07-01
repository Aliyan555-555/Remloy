// src/components/ailment/AIRemediesTab.jsx
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Button from "../common/Button";

import GenerateRemedyPopup from "./GenerateRemedyPopup";
import { getRemediesByAilmentAndType } from "../../api/remediesApi";
import { useAuth } from "../../contexts/AuthContext";

const AIRemediesTab = ({ ailmentId, count, sortOption, activeTab }) => {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGeneratePopup, setShowGeneratePopup] = useState(false);
  const [totalRemediesCount, setTotalRemediesCount] = useState(0);
  const { isAuthenticated,user, addOrRemoveSavedRemedies } = useAuth();
  // Fetch AI remedies based on ailmentId, page, and sortOption

  const fetchRemedies = async () => {
    try {
      setLoading(true);
      const res = await getRemediesByAilmentAndType(
        ailmentId,
        activeTab,
        currentPage,
        sortOption
      );

      if (res.success) {
        setRemedies(res.remedies);
        setTotalPages(res.pagination.pages);
        setTotalRemediesCount(res.pagination.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemedies();
  }, [ailmentId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const handleOpenGeneratePopup = () => {
    setShowGeneratePopup(true);
  };

  const handleSaveRemedy = async (id) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    await addOrRemoveSavedRemedies(id, "save");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div>
      {/* AI Information Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Our AI analyzes thousands of remedies, success rates, and user
              feedback to generate the most effective recommendations.
              <span className="ml-1 underline cursor-pointer">
                How does our AI work?
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Showing {totalRemediesCount} AI Remedies for Migraine Headache
      </p>

      {/* Generate Custom Remedy Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="contained"
          color="brand"
          className="flex items-center"
          onClick={handleOpenGeneratePopup}
        >
          <span className="mr-2">Generate Custom Remedy</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>

      {/* Custom Remedy Info Box */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
        <div className="flex items-center text-center justify-center">
          <div className="bg-brand-green bg-opacity-10 rounded-lg p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-brand-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <p>Use AI to create a personalized remedy based on your needs.</p>
          </div>
        </div>
      </div>

      {/* Remedies Grid */}
      {remedies.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {remedies.map((remedy) => {
            const isSave = user
              ? user.saveRemedies.find((s) => s.remedy._id == remedy._id)
              : false;
            return (
              <div
                key={remedy._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-6">
                  {/* AI Confidence Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 text-xs text-green-800 px-2 py-1 rounded-full">
                      {remedy.category}
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      AI Confidence: {remedy.aiConfidenceScore}%
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{remedy.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {remedy.description}
                  </p>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-brand-green">
                        {remedy.ratings.successRate || 0}%
                      </p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-brand-green">
                        {remedy.ratings.userFeedback || 0}
                      </p>
                      <p className="text-xs text-gray-500">User Feedback</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-brand-green">
                        {remedy.ratings.positiveOutcomes || 0}
                      </p>
                      <p className="text-xs text-gray-500">Positive Outcomes</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(remedy.averageRating)}
                    </div>
                    <span className="text-gray-600 text-sm">
                      ({remedy.reviewCount})
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="readMore"
                      to={`/remedies/ai/${remedy._id}?id=${ailmentId}`}
                      state={{ from: `/ailments/${ailmentId}` }}
                      size="small"
                    >
                      View Details
                    </Button>

                    <div className="flex space-x-3">
                      <button
                        className={`${
                          isSave ? "text-brand-green" : "text-gray-400"
                        } hover:text-brand-green border-none transition-colors`}
                        aria-label="Save remedy"
                        onClick={() => handleSaveRemedy(remedy._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill={isSave ? "#2f6a50" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>

                      <button
                        className="text-gray-400 hover:text-brand-green transition-colors"
                        aria-label="Share remedy"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-10">No Remedies Available</div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <GenerateRemedyPopup
        isOpen={showGeneratePopup}
        ailmentId={ailmentId}
        onClose={() => setShowGeneratePopup(false)}
      />
    </div>
  );
};

export default AIRemediesTab;
