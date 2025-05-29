// src/pages/PremiumDashboardPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

const PremiumDashboardPage = () => {
  const { user } = useAuth();
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [recommendationToDismiss, setRecommendationToDismiss] = useState(null);

  // Handler functions
  const handleDismissClick = (recommendation) => {
    setRecommendationToDismiss(recommendation);
    setShowDismissModal(true);
  };

  const handleDismissConfirm = () => {
    if (recommendationToDismiss) {
      console.log("Dismissing:", recommendationToDismiss.title);
    }

    setShowDismissModal(false);
    setRecommendationToDismiss(null);
  };

  const handleDismissCancel = () => {
    setShowDismissModal(false);
    setRecommendationToDismiss(null);
  };

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "tried",
      remedyName: "Turmeric Tea",
      rating: 4,
      timeAgo: "5h ago",
    },
    {
      id: 2,
      type: "review",
      remedyName: "Ginger Root",
      timeAgo: "5h ago",
    },
  ];

  // Mock saved remedies data
  const savedRemedies = [
    {
      id: 1,
      title: "Turmeric Tea",
      image: "/images/remedies/turmeric-tea.jpg",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Herbal Mix",
      image: "/images/remedies/herbal-mix.jpg",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Turmeric Tea",
      image: "/images/remedies/turmeric-tea.jpg",
      rating: 4.5,
    },
  ];

  // Mock AI recommendations data
  const aiRecommendations = [
    {
      id: 1,
      title: "Custom Blend #1",
      image: "/images/remedies/turmeric-tea.jpg",
      matchPercentage: 95,
      basedOn: "Turmeric Tea",
    },
    {
      id: 2,
      title: "Herbal Mix #2",
      image: "/images/remedies/herbal-mix.jpg",
      matchPercentage: 85,
      basedOn: "Turmeric Tea",
    },
    {
      id: 3,
      title: "Custom Blend #1",
      image: "/images/remedies/turmeric-tea.jpg",
      matchPercentage: 95,
      basedOn: "Turmeric Tea",
    },
  ];

  return (
    <DashboardLayout 
      pageTitle="Dashboard" 
      user={user} 
      isPremiumUser={true}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* My Remedies Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            My Remedies
          </h2>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-3xl font-bold text-gray-900">24</div>
            </div>
            <div className="opacity-400">
              <img
                src="/images/remedy-icon.png"
                alt="Remedies Icon"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            Success Rate
          </h2>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                95%
              </div>
              <p className="text-xs text-gray-600">
                (Your personal remedy success rate based on feedback &
                effectiveness.)
              </p>
            </div>
            <div className="opacity-400">
              <img
                src="/images/success-rate-icon.png"
                alt="Success Rate Icon"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>

        {/* Active Plans Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            Active Plans
          </h2>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xl font-bold text-gray-900 mb-1">
                Premium
              </div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                $9.99/month
              </p>
              <Button
                variant="outlined"
                color="brand"
                size="small"
                to="/pricing"
                className="text-xs px-3 py-1"
              >
                Change Plan
              </Button>
            </div>
            <div className="opacity-400">
              <img
                src="/images/active-plans-icon.png"
                alt="Active Plans Icon"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="p-4 border-b border-gray-100 flex items-start"
            >
              <div className="mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-brand-green"></div>
              </div>
              <div className="flex-grow">
                {activity.type === "tried" ? (
                  <div>
                    <p className="text-gray-700">
                      Tried new remedy :{" "}
                      <span className="font-medium">
                        {activity.remedyName}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Rated {activity.rating} stars{" "}
                      <span className="text-brand-green underline cursor-pointer">
                        (Read More...)
                      </span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">
                      Left a review for{" "}
                      <span className="font-medium">
                        {activity.remedyName}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-brand-green underline cursor-pointer">
                        (See review...)
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {activity.timeAgo}
                </span>
                <div className="flex space-x-3">
                  <button
                    className="text-gray-500 hover:text-brand-green"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    className="text-gray-500 hover:text-brand-green"
                    title="Undo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Remedies Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Saved Remedies
          </h2>
          <Button variant="text" color="brand" to="/saved-remedies">
            View All Saved Remedies
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedRemedies.map((remedy) => (
            <div
              key={remedy.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={remedy.image}
                alt={remedy.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/300x200?text=${remedy.title.replace(
                    /\s+/g,
                    "+"
                  )}`;
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{remedy.title}</h3>
                <div className="flex items-center mt-2 mb-3">
                  <span className="text-gray-700 mr-1">Rating :</span>
                  <span className="font-medium">{remedy.rating}/5</span>
                </div>
                <Button variant="readMore" to={`/remedies/${remedy.id}`}>
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Personalized Recommendations */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          AI-Personalized Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiRecommendations.map((recommendation, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-2xl"
              style={{ backgroundColor: "#f2f5f3" }}
            >
              <h3 className="text-lg font-semibold mb-2">
                {recommendation.title}
              </h3>
              <p className="text-gray-700 mb-2">
                {recommendation.matchPercentage}% match
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-1">
                  Why this was recommended:
                </p>
                <p className="text-sm text-gray-600">
                  Based on your recent activity with{" "}
                  {recommendation.basedOn}.
                </p>
                <div className="flex items-center mt-2">
                  <button className="flex items-center text-sm text-brand-green mr-4">
                    <span className="mr-1">👍</span> Like
                  </button>
                  <button
                    className="flex items-center text-sm text-red-500"
                    onClick={() => handleDismissClick(recommendation)}
                  >
                    <span className="mr-1">❌</span> Dismiss
                  </button>
                </div>
              </div>

              <img
                src={recommendation.image}
                alt={recommendation.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <Button
                variant="readMore"
                to={`/remedies/${recommendation.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                Read More
              </Button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outlined"
            color="brand"
            className="flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            </svg>
            Load More
          </Button>
        </div>
      </div>

      {/* Dismiss Confirmation Modal */}
      {showDismissModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Are you sure you want to dismiss this recommendation?
              </h3>
              <p className="text-gray-600">
                It will be removed from your personalized suggestions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outlined"
                color="default"
                className="flex-1"
                onClick={handleDismissCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="brand"
                className="flex-1"
                onClick={handleDismissConfirm}
              >
                Dismiss Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PremiumDashboardPage;