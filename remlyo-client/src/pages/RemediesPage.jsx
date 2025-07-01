// src/pages/RemediesPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import { getAllRemedies } from "../api/remediesApi";
import LoadingSpinner from "../components/common/LoadingSpinner";

const RemediesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [remedies, setRemedies] = useState([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchRemedies = async () => {
    try {
      setLoading(true);
      const res = await getAllRemedies({ currentPage, limit, search });
      if (res && res.success) {
        setRemedies(res.remedies);
        setLoading(false);
        setTotalPages(res.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemedies();
  }, [search]);

  const getRemedyTypeRoute = (remedy) => {
    // Map remedy types to routes
    const typeRoutes = {
      community: `/remedies/community/${remedy._id}`,
      alternative: `/remedies/alternative/${remedy._id}`,
      pharmaceutical: `/remedies/pharmaceutical/${remedy._id}`,
      ai: `/remedies/ai/${remedy._id}`,
    };

    return typeRoutes[remedy.type] || `/remedies/${remedy._id}`;
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

  // Function to get badge color based on remedy type
  const getBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case "community":
        return "bg-blue-500";
      case "alternative":
        return "bg-purple-500";
      case "ai":
        return "bg-yellow-500";
      case "pharmaceutical":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // You would typically fetch data for the new page here
    window.scrollTo(0, 0);
  };

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

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Header with fixed search bar alignment */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 md:self-center">
              Remlyo Remedies
            </h1>

            <div className="w-full md:w-64 lg:w-80">
              <SearchBar
                onSearch={handleSearch}
                className="w-full"
                placeholder="Search remedies..."
              />
            </div>
          </div>

          {/* Remedies Grid */}
          {remedies.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {remedies.map((remedy) => (
                <div
                  key={remedy._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative">
                    <img
                      src={
                        remedy.media
                          ? remedy.media.source
                          : "https://placehold.co/600x400?text=Remlyo"
                      }
                      alt={remedy.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400?text=Remlyo";
                      }}
                    />
                    <div
                      className={`absolute top-2 left-2 ${getBadgeColor(
                        remedy.type
                      )} text-white px-3 capitalize py-1 rounded-full text-xs font-medium`}
                    >
                      {remedy.type == "ai" ? "AI Generated" : remedy.type}
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold">{remedy.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {remedy.description}
                    </p>

                    {remedy.helps && (
                      <p className="text-sm text-gray-700 mb-2">
                        {remedy.helps}
                      </p>
                    )}

                    {remedy.successRate && (
                      <p className="text-sm text-gray-700 mb-2 font-medium">
                        {remedy.successRate}
                      </p>
                    )}

                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {renderStars(remedy.averageRating)}
                      </div>
                      <span className="text-gray-600 text-sm">
                        ({remedy.reviewCount})
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="mt-auto">
                        <Button
                          variant="readMore"
                          to={getRemedyTypeRoute(remedy)}
                          fullWidth
                        >
                          View Remedy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center text-gray-800 border py-10 rounded-lg border-gray-300">
              No remedies found
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RemediesPage;
