// src/pages/UserDashboardPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const UserDashboardPage = () => {
  const { upgradeToPremium, user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    upgradeToPremium();
    navigate("/premium-dashboard");
  };

  // Mock data - ideally this would come from API
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

  return (
    <DashboardLayout 
      pageTitle="Dashboard" 
      user={user}
      isPremiumUser={false}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* My Remedies Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
          {/* Lock Icon */}
          <div className="absolute top-4 right-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-base font-semibold text-gray-700 mb-2">
            My Remedies
          </h2>

          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
              <p className="text-xs text-red-500">
                You've reached your free limit.
                <br />
                Upgrade for full access.
              </p>
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
          {/* Lock Icon */}
          <div className="absolute top-4 right-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-base font-semibold text-gray-700 mb-2">
            Success Rate
          </h2>

          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600">
                Try and rate more remedies to
                <br />
                unlock your personalized
                <br />
                success score.
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
              <p className="text-sm text-gray-600 mb-1">
                You've used 1 of 3 free full
                <br />
                remedy views.
              </p>
              <p className="text-xs font-medium mb-2">
                Unlock Unlimited Remedies
              </p>
              <Button
                variant="contained"
                color="brand"
                onClick={handleUpgrade}
                className="mt-4"
              >
                Upgrade to Premium
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
      <div>
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
    </DashboardLayout>
  );
};

export default UserDashboardPage;