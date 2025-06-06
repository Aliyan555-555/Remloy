// src/components/ailment/CommunityRemediesTab.jsx
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Button from "../common/Button";

const CommunityRemediesTab = ({ ailmentId, count, sortOption }) => {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch community remedies based on ailmentId, page and sortOption
  useEffect(() => {
    const fetchRemedies = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockRemedies = [
          {
            id: "c1",
            name: "Turmeric Tea Recipe",
            description: "Drink a lot of water with lemon...",
            image: "/images/remedies/turmeric-tea.jpg",
            rating: 5,
            reviewCount: 128,
          },
          {
            id: "c2",
            name: "Ginger Honey Lemon Drink",
            description: "A soothing drink made with fresh ginger...",
            image: "/images/remedies/ginger-lemon.jpg",
            rating: 5,
            reviewCount: 128,
          },
          {
            id: "c3",
            name: "Peppermint Infusion",
            description: "A refreshing herbal infusion made with...",
            image: "/images/remedies/peppermint.jpg",
            rating: 5,
            reviewCount: 128,
          },
          {
            id: "c4",
            name: "Turmeric Tea Recipe",
            description: "Drink a lot of water with lemon...",
            image: "/images/remedies/turmeric-tea.jpg",
            rating: 5,
            reviewCount: 128,
          },
          {
            id: "c5",
            name: "Ginger Honey Lemon Drink",
            description: "A soothing drink made with fresh ginger...",
            image: "/images/remedies/ginger-lemon.jpg",
            rating: 5,
            reviewCount: 128,
          },
          {
            id: "c6",
            name: "Peppermint Infusion",
            description: "A refreshing herbal infusion made with...",
            image: "/images/remedies/peppermint.jpg",
            rating: 5,
            reviewCount: 128,
          },
        ];

        setRemedies(mockRemedies);
        setTotalPages(12); // Mock total pages
        setLoading(false);
      }, 500);
    };

    fetchRemedies();
  }, [ailmentId, currentPage, sortOption]);

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

  // Handle image errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/400x200?text=Remedy+Image";
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
      <p className="text-gray-600 mb-6">
        Showing {count} Community Remedies for Migraine Headache
      </p>

      {/* Create Post Button */}
      <div className="flex justify-end mb-6">
        <Button variant="contained" color="brand" size="medium">
          Create Post <span className="ml-1">+</span>
        </Button>
      </div>

      {/* Remedies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {remedies.map((remedy) => (
          <div
            key={remedy.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={remedy.image}
                alt={remedy.name}
                className="w-full h-48 object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">{remedy.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{remedy.description}</p>

              <div className="flex items-center mb-4">
                <div className="flex mr-2">{renderStars(remedy.rating)}</div>
                <span className="text-gray-600 text-sm">
                  ({remedy.reviewCount})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="readMore"
                  to={`/remedies/community/${remedy.id}`}
                  state={{ from: `/ailments/${ailmentId}` }}
                  size="small"
                >
                  View Details
                </Button>

                <button
                  className="text-gray-400 hover:text-brand-green transition-colors"
                  aria-label="Save remedy"
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
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CommunityRemediesTab;
