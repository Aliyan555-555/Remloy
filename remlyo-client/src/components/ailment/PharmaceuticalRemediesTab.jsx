// src/components/ailment/PharmaceuticalRemediesTab.jsx
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Button from "../common/Button";

const PharmaceuticalRemediesTab = ({ ailmentId, count, sortOption }) => {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch pharmaceutical remedies based on ailmentId, page, and sortOption
  useEffect(() => {
    const fetchRemedies = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockRemedies = [
          {
            id: "p1",
            name: "Sumatriptan",
            description:
              "Selective serotonin receptor agonist for acute migraine treatment...",
            dosage: "50-100mg as needed",
            effectiveness: 92,
            sideEffects: ["Nausea", "Dizziness", "Fatigue"],
            sources: ["WebMD", "RxList", "Mayo Clinic"],
            image: "/images/remedies/pill-1.jpg",
            rating: 5,
            reviewCount: 128,
            availability:
              "Availability varies by region. Consult your local pharmacy or medical expert before use.",
          },
          {
            id: "p2",
            name: "Ibuprofen + Caffeine",
            description: "Combined treatment for mild to moderate migraines...",
            dosage: "400mg + 200mg caffeine",
            effectiveness: 92,
            sideEffects: ["Stomach upset", "Heartburn"],
            sources: ["WebMD", "RxList", "Mayo Clinic"],
            image: "/images/remedies/pill-2.jpg",
            rating: 5,
            reviewCount: 128,
            availability:
              "Availability varies by region. Consult your local pharmacy or medical expert before use.",
          },
          {
            id: "p3",
            name: "Sumatriptan",
            description:
              "Selective serotonin receptor agonist for acute migraine treatment...",
            dosage: "50-100mg as needed",
            effectiveness: 92,
            sideEffects: ["Nausea", "Dizziness", "Fatigue"],
            sources: ["WebMD", "RxList", "Mayo Clinic"],
            image: "/images/remedies/pill-1.jpg",
            rating: 5,
            reviewCount: 128,
            availability:
              "Availability varies by region. Consult your local pharmacy or medical expert before use.",
          },
          {
            id: "p4",
            name: "Ibuprofen + Caffeine",
            description: "Combined treatment for mild to moderate migraines...",
            dosage: "400mg + 200mg caffeine",
            effectiveness: 92,
            sideEffects: ["Stomach upset", "Heartburn"],
            sources: ["WebMD", "RxList", "Mayo Clinic"],
            image: "/images/remedies/pill-2.jpg",
            rating: 5,
            reviewCount: 128,
            availability:
              "Availability varies by region. Consult your local pharmacy or medical expert before use.",
          },
        ];

        setRemedies(mockRemedies);
        setTotalPages(4); // Mock total pages
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Warning Message */}
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
              Always consult with a healthcare professional before starting any
              medication
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Showing {count} Pharmaceutical Remedies for Migraine Headache
      </p>

      {/* Remedies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {remedies.map((remedy) => (
          <div
            key={remedy.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-6">
              {/* Pill Icon and Effectiveness Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-100 p-2 rounded-md">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {remedy.effectiveness}% Effective
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{remedy.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{remedy.description}</p>

              {/* Dosage */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Recommended Dosage:
                </h4>
                <p className="text-sm text-gray-600">{remedy.dosage}</p>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <p className="text-xs text-red-600 italic">
                  "{remedy.availability}"
                </p>
              </div>

              {/* Side Effects */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Potential Side Effects:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {remedy.sideEffects.map((effect, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              {/* Source References */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Sourced from Medical References
                </h4>
                <p className="text-xs text-gray-500">
                  (e.g., {remedy.sources.join(", ")})
                </p>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex mr-2">{renderStars(remedy.rating)}</div>
                <span className="text-gray-600 text-sm">
                  ({remedy.reviewCount})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="readMore"
                  to={`/remedies/pharmaceutical/${remedy.id}`}
                  state={{ from: `/ailments/${ailmentId}` }}
                  size="small"
                >
                  View Details
                </Button>

                <div className="flex space-x-3">
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

export default PharmaceuticalRemediesTab;
