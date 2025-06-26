// src/pages/SavedRemediesPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

const SavedRemediesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Defensive checks for user and subscription
  const plan = user?.activeSubscription?.plan || {};
  const isFree = plan.price === 0;

  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [remedyToDelete, setRemedyToDelete] = useState(null);

  // Mock saved remedies data
  const [savedRemedies, setSavedRemedies] = useState([
    {
      id: 1,
      title: "Turmeric Tea",
      image: "/images/remedies/turmeric-tea.jpg",
      rating: 4.5,
      isFavorite: true,
      status: "saved",
    },
    {
      id: 2,
      title: "Herbal Mix",
      image: "/images/remedies/herbal-mix.jpg",
      rating: 4.9,
      isFavorite: false,
      status: "toTry",
    },
    {
      id: 3,
      title: "Turmeric Tea",
      image: "/images/remedies/turmeric-tea.jpg",
      rating: 4.5,
      isFavorite: true,
      status: "saved",
    },
    {
      id: 4,
      title: "Herbal Mix",
      image: "/images/remedies/herbal-mix.jpg",
      rating: 4.9,
      isFavorite: false,
      status: "saved",
    },
    {
      id: 5,
      title: "Turmeric Tea",
      image: "/images/remedies/turmeric-tea.jpg",
      rating: 4.5,
      isFavorite: true,
      status: "saved",
    },
    {
      id: 6,
      title: "Herbal Mix",
      image: "/images/remedies/herbal-mix.jpg",
      rating: 4.9,
      isFavorite: false,
      status: "toTry",
    },
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    communityRemedies: false,
    alternativeRemedies: false,
    pharmaceuticalsRemedies: false,
    aiRemedies: false,
  });

  // Filter remedies based on active filter
  const getFilteredRemedies = () => {
    let filtered = [...savedRemedies];

    if (activeFilter === "toTry") {
      filtered = filtered.filter((remedy) => remedy.status === "toTry");
    } else if (activeFilter === "favorite") {
      filtered = filtered.filter((r) => r.isFavorite);
    }

    // Apply type filters if any are selected
    const anyTypeFilters = Object.values(filters).some((value) => value);
    if (anyTypeFilters) {
      // This is just mock filtering since we don't have type properties in the data
      // In a real app, you would filter based on actual remedy types
    }

    return filtered;
  };

  // Delete remedy handlers
  const handleDeleteClick = (remedy) => {
    setRemedyToDelete(remedy);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (remedyToDelete) {
      setSavedRemedies((prevRemedies) =>
        prevRemedies.filter((r) => r.id !== remedyToDelete.id)
      );
    }
    setShowDeleteModal(false);
    setRemedyToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRemedyToDelete(null);
  };

  // Filter handlers
  const handleFilterReset = () => {
    setFilters({
      communityRemedies: false,
      alternativeRemedies: false,
      pharmaceuticalsRemedies: false,
      aiRemedies: false,
    });
  };

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <DashboardLayout
      pageTitle="My Saved Remedies"
      user={user}
      isPremiumUser={isPremiumUser}
    >
      {/* Tab Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <Button
            variant={activeFilter === "all" ? "contained" : "outlined"}
            color="brand"
            onClick={() => setActiveFilter("all")}
          >
            All Saved ({savedRemedies.length})
          </Button>
          <Button
            variant={activeFilter === "toTry" ? "contained" : "outlined"}
            color="brand"
            onClick={() => setActiveFilter("toTry")}
          >
            To Try ({savedRemedies.filter((r) => r.status === "toTry").length})
          </Button>
          <Button
            variant={activeFilter === "favorite" ? "contained" : "outlined"}
            color="brand"
            onClick={() => setActiveFilter("favorite")}
          >
            Favourite ({savedRemedies.filter((r) => r.isFavorite).length})
          </Button>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          {/* Filter Button */}
          <Button
            variant="outlined"
            color="default"
            className="flex items-center space-x-1"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filters
          </Button>

          {/* Filter Dropdown Content */}
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-4">
                <div className="mb-3">
                  <p className="font-medium mb-2">Sort by</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="most-recent"
                        name="sort-order"
                        defaultChecked
                        className="mr-2"
                      />
                      <label htmlFor="most-recent">Most Recent</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="highest-rated"
                        name="sort-order"
                        className="mr-2"
                      />
                      <label htmlFor="highest-rated">Highest Rated</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="a-z"
                        name="sort-order"
                        className="mr-2"
                      />
                      <label htmlFor="a-z">A-Z</label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium mb-2">by Remedy Type</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="community-remedies"
                        checked={filters.communityRemedies}
                        onChange={() => handleFilterChange("communityRemedies")}
                        className="mr-2"
                      />
                      <label htmlFor="community-remedies">
                        Community Remedies
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="alternative-remedies"
                        checked={filters.alternativeRemedies}
                        onChange={() =>
                          handleFilterChange("alternativeRemedies")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="alternative-remedies">
                        Alternative Remedies
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pharmaceuticals-remedies"
                        checked={filters.pharmaceuticalsRemedies}
                        onChange={() =>
                          handleFilterChange("pharmaceuticalsRemedies")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="pharmaceuticals-remedies">
                        Pharmaceuticals Remedies
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ai-remedies"
                        checked={filters.aiRemedies}
                        onChange={() => handleFilterChange("aiRemedies")}
                        className="mr-2"
                      />
                      <label htmlFor="ai-remedies">AI Remedies</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="text"
                    color="default"
                    onClick={handleFilterReset}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="brand"
                    onClick={() => setShowFilterDropdown(false)}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remedies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getFilteredRemedies().map((remedy) => (
          <div
            key={remedy.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="relative">
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
              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 text-gray-700"
                onClick={() => handleDeleteClick(remedy)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {remedy.id === 1 && (
                <div className="absolute top-0 left-0 bg-gray-200 px-3 py-1 text-sm text-gray-700">
                  Removed from Saved
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{remedy.title}</h3>
              <div className="flex items-center mb-3">
                <span className="text-gray-700 mr-1">Rating :</span>
                <span className="font-medium">{remedy.rating}/5</span>
              </div>

              <Button
                variant="contained"
                color="brand"
                className="w-full justify-center"
                to={`/remedies/${remedy.id}`}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Free user limitation message - Only show for free users */}
      {!isPremiumUser && (
        <div className="mt-8 text-center p-6 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            You've reached your free account limit
          </h3>
          <p className="text-gray-700 mb-4">
            Upgrade to premium to save unlimited remedies and unlock
            personalized AI recommendations
          </p>
          <Button variant="contained" color="brand" to="/pricing">
            Upgrade to Premium
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <p className="text-center text-lg mb-6">
              Are you sure you want to remove this from your saved remedies?
            </p>
            <div className="flex justify-between space-x-4">
              <Button
                variant="outlined"
                color="default"
                className="flex-1"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="brand"
                className="flex-1"
                onClick={handleConfirmDelete}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedRemediesPage;
