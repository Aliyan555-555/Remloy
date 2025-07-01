// src/pages/AIInsightPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import { getAIRemedyInsights } from "../api/remediesApi";

// SVG Icon Components
const Icon = ({ children, className = "", ...props }) => (
  <svg className={className} {...props} aria-hidden="true">
    {children}
  </svg>
);

const icons = {
  age: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-brand-green mr-2 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </Icon>
  ),
  diet: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-brand-green mr-2 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </Icon>
  ),
  stress: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-brand-green mr-2 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </Icon>
  ),
  previous: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-brand-green mr-2 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </Icon>
  ),
  reason: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </Icon>
  ),
  learning: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </Icon>
  ),
  adjustment: (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </Icon>
  ),
};

// List Item Components
const ReasonItem = ({ reason }) => (
  <li className="flex items-start">
    {icons.reason}
    <span className="text-gray-700">{reason}</span>
  </li>
);
const LearningLogItem = ({ entry }) => (
  <li className="flex items-start">
    {icons.learning}
    <span className="text-gray-700">{entry}</span>
  </li>
);

const AIInsightPage = () => {
  const { remedyId } = useParams();
  const { authToken } = useAuth();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAIInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAIRemedyInsights(authToken, remedyId);
      if (res.success) {
        setInsight(res.insights);
      } else {
        setError("Failed to fetch AI insights.");
      }
    } catch (err) {
      setError("An error occurred while fetching insights.");
    } finally {
      setLoading(false);
    }
  }, [authToken, remedyId]);

  useEffect(() => {
    fetchAIInsight();
  }, [fetchAIInsight]);

  const getRemedyTypeRoute = (remedy) => {
    const typeRoutes = {
      community: `/remedies/community/${remedy}`,
      alternative: `/remedies/alternative/${remedy}`,
      pharmaceutical: `/remedies/pharmaceutical/${remedy}`,
      ai: `/remedies/ai/${remedy}`,
    };
    return typeRoutes["ai"] || `/remedies/${remedy}`;
  };

  // Defensive: show loading, error, or not found
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-brand-green text-white py-2 text-center">
          <div className="container mx-auto px-4">
            <span>🌿 AI-Powered Remedy Recommendations Available!</span>
          </div>
        </div>
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green" aria-label="Loading"></div>
        </div>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-red-600 text-lg">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }
  if (!insight || !insight.advanceAiInsights) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-600 text-lg">No AI insights found for this remedy.</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Destructure for cleaner code
  const { advanceAiInsights } = insight;
  const matched = advanceAiInsights.matchedFactors || {};
  const aiConfidence = advanceAiInsights.aiConfidenceRating || {};
  const selectedReasons = advanceAiInsights.selectedReasons || [];
  const aiLearningLog = advanceAiInsights.aiLearningLog?.insights || [];
  const adjustmentNotice = advanceAiInsights.remedyAdjustmentNotice || {};

  return (
    <div className="min-h-screen flex flex-col">
      {/* AI Banner */}
      <div className="bg-brand-green text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <span>🌿 AI-Powered Remedy Recommendations Available!</span>
        </div>
      </div>
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outlined"
              color="brand"
              size="small"
              to={getRemedyTypeRoute(remedyId)}
              className="flex items-center"
              aria-label="Back to Remedies"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Remedies
            </Button>
          </div>
          {/* Insight Title and Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {advanceAiInsights.title || "AI Remedy Insight"}
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {advanceAiInsights.description || "No description available."}
            </p>
          </div>
          {/* Personal Health Match Score */}
          <div className="bg-white border border-green-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-brand-green mb-3">
              Personal Health Match Score
            </h2>
            <p className="text-gray-700 mb-4">
              This remedy was selected based on a {advanceAiInsights.healthMatchScore ?? 0}% match with your health profile.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-start">{icons.age}
                <div>
                  <span className="font-medium text-gray-700">Age: </span>
                  <span className="text-gray-600">{matched.ageRange || "-"}</span>
                </div>
              </div>
              <div className="flex items-start">{icons.diet}
                <div>
                  <span className="font-medium text-gray-700">Diet: </span>
                  <span className="text-gray-600">{matched.diet || "-"}</span>
                </div>
              </div>
              <div className="flex items-start">{icons.stress}
                <div>
                  <span className="font-medium text-gray-700">Chronic stress: </span>
                  <span className="text-gray-600">{matched.stressLevel || "-"}</span>
                </div>
              </div>
              <div className="flex items-start">{icons.previous}
                <div>
                  <span className="font-medium text-gray-700">Previous remedy success: </span>
                  <span className="text-gray-600">{matched.previousRemedySuccess || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* AI Confidence Rating */}
          <div className="bg-white border border-blue-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-3">AI Confidence Rating</h2>
            <div className="mb-4 flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-3">
                {aiConfidence.score ?? 0}% Confidence
              </div>
              <div className="text-gray-600 text-sm">
                {/* {aiConfidence.description} */}
              </div>
            </div>
            {/* Confidence Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${aiConfidence.score ?? 0}%` }}
                aria-label="AI Confidence Bar"
              ></div>
            </div>
          </div>
          {/* Why This Was Selected */}
          <div className="bg-white border border-yellow-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-yellow-600 mb-3">Why This Was Selected</h2>
            <ul className="space-y-3">
              {selectedReasons.length > 0 ? (
                selectedReasons.map((reason, index) => <ReasonItem reason={reason} key={index} />)
              ) : (
                <li className="text-gray-500">No reasons provided.</li>
              )}
            </ul>
          </div>
          {/* AI Learning Log */}
          <div className="bg-white border border-purple-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-600 mb-3">AI Learning Log</h2>
            <ul className="space-y-3">
              {aiLearningLog.length > 0 ? (
                aiLearningLog.map((entry, index) => <LearningLogItem entry={entry} key={index} />)
              ) : (
                <li className="text-gray-500">No learning log entries.</li>
              )}
            </ul>
          </div>
          {/* Remedy Adjustment Notice */}
          <div className="bg-white border border-green-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-600 mb-3">Remedy Adjustment Notice</h2>
            <div className="flex items-start">
              {icons.adjustment}
              <span className="text-gray-700">{adjustmentNotice.message || "No adjustment notice."}</span>
            </div>
          </div>
          {/* Disclaimer */}
          {advanceAiInsights.disclaimerShown && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
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
                    This information is not a medical diagnosis. Always consult a healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Get Custom Remedy Button */}
          <div className="text-center mb-8">
            <Button
              variant="contained"
              color="brand"
              size="large"
              className="group"
              aria-label="Generate Custom Remedy"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Generate Custom Remedy
              </span>
            </Button>
            <p className="text-gray-600 text-sm mt-2">
              Create a new personalized remedy based on your latest profile data
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIInsightPage;
