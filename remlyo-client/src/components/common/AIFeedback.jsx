import React, { useEffect, useState } from "react";
import { getAIfeedback } from "../../api/remediesApi";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const AIFeedback = ({ toggleAIInsightPopup, loading, content, error }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={toggleAIInsightPopup}
    >
      <div
        className="bg-white max-h-[95vh]  rounded-lg shadow-xl max-w-md w-full relative transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center sticky top-0 justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">
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
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h3 className="text-lg font-medium text-gray-900">
              Remi's AI Feedback
            </h3>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={toggleAIInsightPopup}
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {loading && <LoadingSpinner />}
        {error ? (
          <div className="p-6 flex flex-col items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
            <h4 className="text-xl font-semibold mb-2">Server Error</h4>
            <p className="text-gray-600 mb-4">Sorry, we couldn't fetch the AI feedback at this time. Please try again later.</p>
          </div>
        ) : (
          <div
            className="px-6 prose max-h-[80vh] pb-10 pt-5 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AIFeedback;
