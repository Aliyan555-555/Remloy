// src/components/ailment/AlternativeRemediesTab.jsx
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Button from "../common/Button";
import { getRemediesByAilmentAndType } from "../../api/remediesApi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { saveRemedy } from "../../api/userApi";

const AlternativeRemediesTab = ({ ailmentId, sortOption, activeTab }) => {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRemediesCount, setTotalRemediesCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { authToken, isAuthenticated, user, addOrRemoveSavedRemedies } = useAuth();
  const navigate = useNavigate();
  //
  // Fetch community remedies based on ailmentId, page and sortOption
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

  const handleSaveRemedy = async (id) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    await addOrRemoveSavedRemedies(id, "save");
  };
  useEffect(() => {
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
    e.target.src =
      "https://via.placeholder.com/400x200?text=Alternative+Remedy";
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
      <div className="flex items-center justify-center mb-6">
        <div className="bg-white rounded-full shadow px-4 py-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-brand-green mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-700 font-medium">
            Validated by User Ratings & Success Data
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Showing {totalRemediesCount} Alternative Remedies for Migraine Headache
      </p>

      {/* Remedies Grid */}
      {remedies.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {remedies.map((remedy) => {
            const isSave = user
              ? user.saveRemedies.find((s) => s.remedy._id == remedy._id)
              : false;
            return (
              <div
                key={remedy._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Success Rate Badge */}
                <div className="relative">
                  <img
                    src={remedy.media.source}
                    alt={remedy.name}
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 right-3 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {remedy.successRate || 0}% Success Rate
                  </div>
                </div>

                <div className="p-5">
                  {/* Practitioner Info */}
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img
                        src={remedy.createdBy.profileImage}
                        alt={remedy.createdBy.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/32x32?text=P";
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      {remedy.createdBy.name}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{remedy.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {remedy.category}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {remedy.description}
                  </p>

                  {/* Requirements */}
                  {/* <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Requirements:
                </p>
                <div className="flex flex-wrap gap-2">
                  {remedy.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                    >
                      {req.name}
                    </span>
                  ))}
                </div>
              </div> */}

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
                      to={`/remedies/alternative/${remedy._id}?id=${ailmentId}`}
                      state={{ from: `/ailments/${ailmentId}` }}
                      size="small"
                    >
                      View Details
                    </Button>

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
    </div>
  );
};

export default AlternativeRemediesTab;
