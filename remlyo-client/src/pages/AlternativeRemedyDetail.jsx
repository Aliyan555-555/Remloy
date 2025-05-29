// src/pages/AlternativeRemedyDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";

const AlternativeRemedyDetail = () => {
  const { remedyId } = useParams();
  const location = useLocation();

  const getBackPath = () => {
    if (location.state?.from && location.state.from.includes("/ailments/")) {
      return location.state.from;
    }

    const referrer = document.referrer;
    if (referrer && referrer.includes("/ailments/")) {
      return referrer;
    }

    if (remedyId.startsWith("a")) {
      return "/ailments/migraine";
    }

    // Default fallback
    return "/remedies";
  };

  const backPath = getBackPath();
  const backLabel = backPath.includes("/ailments/")
    ? "Back to Ailment"
    : "Back to Remedies";
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showAIInsightPopup, setShowAIInsightPopup] = useState(false);

  // Fetch remedy details
  useEffect(() => {
    const fetchRemedyDetails = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockRemedy = {
          id: remedyId,
          type: "Alternative Remedy",
          name: "Acupuncture Treatment & Benefits",
          description:
            "Discover the ancient healing power of acupuncture with this comprehensive guide. From how it works to health benefits, dive into the world of traditional Chinese medicine.",
          postedBy: "Dr. Jane",
          postedDate: "March 3, 2025",
          updatedDate: "March 5, 2025",
          verifiedPractitioner: true,
          rating: 5,
          reviewCount: 128,
          image: "/images/remedies/acupuncture.jpg",
          applicationTime: "Takes 1-2 hours",
          ingredients: [
            "Acupuncture needles are essential for the treatment.",
            "Alcohol swabs are used to clean the skin before needle insertion.",
            "Moxa sticks are used for moxibustion to warm and invigorate the flow of Qi.",
            "Therapeutic oils are added for relaxation and to enhance the treatment.",
            "Cotton balls are used to apply pressure and avoid bleeding post needle removal.",
          ],
          equipment: [
            "Sterile acupuncture needles",
            "Treatment bed",
            "Alcohol swabs",
            "Sharps disposal container",
            "Acupuncture needles",
          ],
          treatmentDetails: {
            title: "What is Acupuncture Treatment?",
            description:
              "Acupuncture involves inserting thin needles into specific points on the body to stimulate natural healing and relieve pain. Practiced for thousands of years, it's revered for its effectiveness in treating various ailments and enhancing overall well-being.",
          },
          instructions: [
            {
              step: "Preparation",
              detail:
                "Ensure a clean, well-lit environment with sterile tools. If not self-administering, verify the practitioner is licensed and trained",
            },
            {
              step: "Needle Insertion",
              detail:
                "Insert sterile needles into acupoints, following the practitioner's directions.",
            },
            {
              step: "Relaxation",
              detail:
                "Allow the patient to rest with the needles in place for the recommended duration.",
            },
            {
              step: "Needle Removal",
              detail:
                "Carefully remove the needles and dispose of them properly.",
            },
            {
              step: "Post-Treatment Care",
              detail:
                "Advise the patient on aftercare, including hydration and rest.",
            },
          ],
          precautions: [
            {
              title: "Choose Qualified Practitioner",
              detail:
                "Ensure that the acupuncturist is licensed and certified. Proper training and experience are crucial for safe practice.",
            },
            {
              title: "Sterile Needles",
              detail:
                "Make sure the practitioner uses sterile, disposable needles to prevent infections.",
            },
          ],
          sideEffects: [
            {
              title: "Fatigue",
              detail:
                "Some people feel tired or lightheaded after an acupuncture session.",
            },
            {
              title: "Infection",
              detail:
                "There is a small risk of infection if the needles are not sterile.",
            },
          ],
          conclusion:
            "Acupuncture offers a holistic approach to health, addressing both physical and emotional well-being. Try this ancient practice to experience its therapeutic benefits.",
          relatedRemedies: [
            {
              id: "r1",
              name: "Aromatherapy with Lavender",
              type: "Aromatherapy",
              description:
                "Essential oil therapy using pure lavender oil & Powder...",
              image: "/images/remedies/aromatherapy.jpg",
              rating: 5,
              reviewCount: 128,
              successRate: 78,
              requirements: [
                { name: "Pure Essential Oils", value: true },
                { name: "Diffuser", value: true },
              ],
            },
          ],
        };

        // Mock comments
        const mockComments = [
          {
            id: "c1",
            user: {
              name: "Marie Claire",
              avatar: "/images/avatars/user1.jpg",
            },
            text: "I recently made a turmeric tea recipe that I found very helpful, and I'd like to try it once!",
            upvotes: 100,
            date: "3h ago",
          },
          {
            id: "c2",
            user: {
              name: "Romeo",
              avatar: "/images/avatars/user2.jpg",
            },
            text: "Yes, I found it helpful, great remedy....",
            upvotes: 30,
            date: "3h ago",
          },
          {
            id: "c3",
            user: {
              name: "Joy Claire",
              avatar: "/images/avatars/user3.jpg",
            },
            text: "Great Remedy....",
            upvotes: 10,
            date: "4h ago",
          },
        ];

        setRemedy(mockRemedy);
        setComments(mockComments);
        setLoading(false);
      }, 500);
    };

    fetchRemedyDetails();
  }, [remedyId]);

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

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c${comments.length + 1}`,
      user: {
        name: "You",
        avatar: "/images/avatars/default.jpg",
      },
      text: newComment,
      upvotes: 0,
      date: "Just now",
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  // Handle sorting change
  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);

    // Sort comments based on selected option
    let sortedComments = [...comments];

    if (option === "newest") {
      // Already sorted by newest in our mock data
    } else if (option === "most helpful") {
      sortedComments.sort((a, b) => b.upvotes - a.upvotes);
    } else if (option === "top rated") {
      sortedComments.sort((a, b) => b.upvotes - a.upvotes);
    }

    setComments(sortedComments);
  };

  // Toggle AI Insight Popup
  const toggleAIInsightPopup = () => {
    setShowAIInsightPopup(!showAIInsightPopup);
  };

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
        <Footer />
      </div>
    );
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
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outlined"
              color="brand"
              size="small"
              to={backPath}
              className="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {backLabel}
            </Button>
          </div>

          {/* Remedy Type Badge - CENTERED */}
          <div className="text-center mb-4">
            <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
              {remedy.type}
            </span>
          </div>

          {/* Remedy Title - CENTERED */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {remedy.name}
          </h1>

          {/* Posted Information - CENTERED */}
          <div className="text-gray-600 text-sm mb-4 text-center">
            Posted by {remedy.postedBy} on {remedy.postedDate}
            {remedy.updatedDate && ` (Last updated on ${remedy.updatedDate})`}
            {remedy.verifiedPractitioner && (
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                Verified Practitioner
              </span>
            )}
          </div>

          {/* Rating and Actions - RESPONSIVE */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center mb-3">
              <div className="flex mr-2">{renderStars(remedy.rating)}</div>
              <span className="text-gray-600 text-sm">
                ({remedy.reviewCount})
              </span>
              <button className="ml-2 text-brand-green underline text-sm">
                Rate this remedy
              </button>
            </div>

            {/* Desktop Buttons - Shown only on desktop */}
            <div className="hidden md:flex space-x-3">
              <Button
                variant="outlined"
                color="brand"
                size="small"
                className="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </Button>

              <Button
                variant="outlined"
                color="brand"
                size="small"
                className="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Add to favorite
              </Button>

              <Button
                variant="outlined"
                color="brand"
                size="small"
                className="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Try
              </Button>

              <Button
                variant="outlined"
                color="brand"
                size="small"
                className="flex items-center"
                onClick={toggleAIInsightPopup}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                </svg>
                What does Remi think?
              </Button>
            </div>

            {/* Mobile Circular Buttons - Shown only on mobile */}
            <div className="flex md:hidden justify-center gap-4">
              <button
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition duration-150"
                aria-label="Share"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>

              <button
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition duration-150"
                aria-label="Add to favorite"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <button
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition duration-150"
                aria-label="Try"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition duration-150"
                aria-label="What does Remi think"
                onClick={toggleAIInsightPopup}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Remedy Description */}
          <p className="text-gray-700 mb-6">{remedy.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Remedy Image */}
              <div className="mb-6">
                <img
                  src={remedy.image}
                  alt={remedy.name}
                  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Alternative+Remedy";
                  }}
                />
              </div>

              {/* What is Acupuncture */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {remedy.treatmentDetails.title}
                </h2>
                <p className="text-gray-700">
                  {remedy.treatmentDetails.description}
                </p>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Instructions
                </h2>
                <ul className="space-y-4">
                  {remedy.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <span className="font-semibold">
                          {instruction.step} :{" "}
                        </span>
                        <span className="text-gray-700">
                          {instruction.detail}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Precautions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Precautions
                </h2>
                <ul className="space-y-4">
                  {remedy.precautions.map((precaution, index) => (
                    <li key={index} className="flex">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <span className="font-semibold">
                          {precaution.title} :{" "}
                        </span>
                        <span className="text-gray-700">
                          {precaution.detail}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Possible Side Effects */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Possible Side Effects
                </h2>
                <ul className="space-y-4">
                  {remedy.sideEffects.map((effect, index) => (
                    <li key={index} className="flex">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <span className="font-semibold">{effect.title} : </span>
                        <span className="text-gray-700">{effect.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conclusion */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Conclusion
                </h2>
                <p className="text-gray-700">{remedy.conclusion}</p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-1">
              {/* Application Time */}
              <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Estimated Application Time
                </h3>
                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-brand-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {remedy.applicationTime}
                </p>
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {remedy.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-brand-green mr-2">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Equipment
                </h3>
                <ul className="space-y-2">
                  {remedy.equipment.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-brand-green mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Remedies */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Related Remedies
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {remedy.relatedRemedies.map((related) => (
                <div
                  key={related.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="flex flex-wrap md:flex-nowrap">
                    <div className="w-full md:w-1/3">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/400x200?text=Related+Remedy";
                        }}
                      />
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                      <div className="mb-2">
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {related.type}
                        </span>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {related.successRate}% Success Rate
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        {related.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {related.description}
                      </p>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Requirements:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {related.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                            >
                              {req.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {renderStars(related.rating)}
                        </div>
                        <span className="text-gray-600 text-sm">
                          ({related.reviewCount})
                        </span>
                      </div>

                      <Button
                        variant="readMore"
                        to={`/remedies/${related.id}`}
                        size="small"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>

            {/* Comment Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src="/images/avatars/default.jpg"
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40x40?text=You";
                  }}
                />
              </div>
              <form onSubmit={handleCommentSubmit} className="flex-grow flex">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <Button
                  variant="contained"
                  color="brand"
                  type="submit"
                  className="rounded-l-none"
                >
                  Add comment
                </Button>
              </form>
            </div>

            {/* Sort comments */}
            <div className="flex justify-end mb-4">
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                  Sort By
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isSortDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                      }
                    />
                  </svg>
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                    <ul className="py-1">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSortChange("newest")}
                      >
                        Newest
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSortChange("most helpful")}
                      >
                        Most Helpful
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSortChange("top rated")}
                      >
                        Top Rated
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/40x40?text=User";
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">
                          {comment.user.name}
                        </h4>
                        <div className="text-gray-500 text-sm flex items-center">
                          <span className="mr-2">{comment.upvotes} Upvote</span>
                          <span>{comment.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.text}</p>
                      <button className="text-gray-500 text-sm mt-2 hover:text-brand-green">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* AI Insight Popup */}
      {showAIInsightPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative transform transition-all">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Hi Ryan,</h4>
              <p className="text-gray-600 mb-4">
                Here's what I found about this remedy for Migraine Headache:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    264 users rated this remedy.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    Average rating: 4.2 out of 5
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    Clinical studies show acupuncture may help reduce migraine
                    frequency.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    Works by targeting specific nerve pathways that reduce pain
                    signals.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    AI Insight: People with your migraine pattern typically
                    report 30% fewer episodes with regular treatments.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    Bonus Tip: Consider combining with stress reduction
                    techniques for enhanced benefits.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AlternativeRemedyDetail;
