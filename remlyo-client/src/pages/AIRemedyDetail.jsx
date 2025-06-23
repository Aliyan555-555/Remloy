// src/pages/AIRemedyDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";

const AIRemedyDetail = () => {
  const { remedyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showAIInsightPopup, setShowAIInsightPopup] = useState(false);

  

  // Add getBackPath function
  const getBackPath = () => {
    if (location.state?.from && location.state.from.includes("/ailments/")) {
      return location.state.from;
    }

    const referrer = document.referrer;
    if (referrer && referrer.includes("/ailments/")) {
      return referrer;
    }

    if (remedyId.startsWith("ai")) {
      return "/ailments/migraine";
    }

    // Default fallback
    return "/remedies";
  };

  const backPath = getBackPath();
  const backLabel = backPath.includes("/ailments/")
    ? "Back to Ailment"
    : "Back to Remedies";

  // Fetch remedy details
  useEffect(() => {
    const fetchRemedyDetails = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockRemedy = {
          id: remedyId,
          type: "AI-Generated Remedy",
          name: "Custom Herbal Blend #MT-291",
          description:
            "This herbal blend is tailored to your specific health profile and past remedy successes. It combines a selection of herbs known for their synergistic effects in promoting well-being and addressing your unique health needs.",
          generatedDate: "March 3, 2025",
          updatedDate: "March 5, 2025",
          rating: 5,
          reviewCount: 128,
          image: "/images/remedies/lifestyle-protocol.jpg",
          preparationTime: "Takes 5-10 minutes to prepare",
          ingredients: [
            "2½ cups water",
            "1 tbsp custom herbal blend (combination of herbs tailored to your health profile)",
            "¼ tsp black pepper (optional, to enhance absorption)",
            "1 tbsp honey (optional, for taste)",
          ],
          equipment: [
            "Small saucepan",
            "Strainer",
            "Mugs",
            "Pestle or something similar for crushing",
          ],
          aiConfidence: {
            score: 95,
            basis: "Based on your Health & Lifestyle Profile",
          },
          confidenceDetails:
            "95% confidence in the effectiveness of this blend based on your profile and similar user data.",
          effectiveness: {
            successRate: 85,
            usersCount:
              "85% of users who tried this blend reported significant improvement in their symptoms.",
            positiveOutcomes: 155,
            userFeedback: 189,
          },
          whyRecommended:
            "Based on your health profile, which includes your reported symptoms, lifestyle factors, and past remedy successes, this custom herbal blend was recommended to support your overall health and wellness. The AI has analyzed data from users with similar profiles to suggest a blend that has shown positive outcomes.",
          instructions: [
            {
              step: "Preparation",
              detail:
                "Mix 1 teaspoon of the herbal blend with 8 ounces of hot water.",
            },
            {
              step: "Steeping",
              detail:
                "Let it steep for 10-15 minutes to allow the herbs to fully infuse.",
            },
            {
              step: "Consumption",
              detail:
                "Drink the tea while warm, preferably before meals or at bedtime.",
            },
            {
              step: "Frequency",
              detail: "Consume 1-2 cups daily for optimal results.",
            },
            {
              step: "Storage",
              detail:
                "Store the blend in a cool, dry place away from direct sunlight.",
            },
          ],
          sideEffects: {
            common:
              "Common Side Effects: Mild stomach discomfort, which usually subsides as your body adjusts to the blend.",
            rare: "Rare Side Effects: Allergic reactions in individuals sensitive to specific herbs.",
            precautions:
              "Precautions: Consult with a healthcare provider before starting this remedy, especially if you are pregnant, breastfeeding, or taking other medications.",
          },
          relatedRemedies: [
            {
              id: "r1",
              name: "Lifestyle Protocol #LP-182",
              description: "AI-optimized daily routine for migraine prevention",
              confidence: 95,
              category: "Lifestyle Modification",
              successRate: 89,
              userFeedback: 245,
              positiveOutcomes: 218,
              image: "/images/remedies/lifestyle-protocol.jpg",
              rating: 5,
              reviewCount: 128,
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

  // Navigate to Advanced AI Insight
  const navigateToAdvancedAIInsight = () => {
    navigate(`/ai-insight/${remedyId}`);
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
            <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm">
              {remedy.type}
            </span>
          </div>

          {/* Remedy Title - CENTERED */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {remedy.name}
          </h1>

          {/* Generated Date Information - CENTERED */}
          <div className="text-gray-600 text-sm mb-4 text-center">
            AI-Generated Personalized Remedy - Generated on{" "}
            {remedy.generatedDate}
            {remedy.updatedDate && `, last updated on ${remedy.updatedDate}`}
          </div>

          {/* Rating and Actions - RESPONSIVE (Similar to AlternativeRemedyDetail) */}
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
          <p className="text-gray-700 mb-6 text-center">{remedy.description}</p>

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
                      "https://via.placeholder.com/800x400?text=AI+Remedy";
                  }}
                />
              </div>

              {/* AI Confidence Score */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  AI Confidence Score
                </h2>
                <div className="flex items-center mb-3">
                  <div className="bg-brand-green rounded-full text-white px-3 py-1 text-sm font-medium mr-3">
                    {remedy.aiConfidence.score}% Confidence
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    {remedy.aiConfidence.basis}
                  </p>
                </div>
                <p className="text-gray-700">{remedy.confidenceDetails}</p>
              </div>

              {/* Why This Was Recommended */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Why This Was Recommended?
                </h2>
                <p className="text-gray-700 mb-4">{remedy.whyRecommended}</p>

                {/* View Full AI Insight Button */}
                <Button
                  variant="contained"
                  color="brand"
                  className="flex items-center"
                  onClick={navigateToAdvancedAIInsight}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Full AI Insight <span className="ml-1">→</span>
                </Button>
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

              {/* Effectiveness Data */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Effectiveness Data
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-4">
                  <div className="bg-white rounded-lg shadow-md p-5">
                    <p className="text-3xl font-bold text-brand-green">
                      {remedy.effectiveness.successRate}%
                    </p>
                    <p className="text-gray-600 text-sm mt-1">Success Rate</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-5">
                    <p className="text-3xl font-bold text-brand-green">
                      {remedy.effectiveness.userFeedback}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">User Feedback</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-5">
                    <p className="text-3xl font-bold text-brand-green">
                      {remedy.effectiveness.positiveOutcomes}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Positive Outcomes
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Success Rate: </span>
                  {remedy.effectiveness.usersCount}
                </p>
              </div>

              {/* Potential Side Effects & Precautions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Potential Side Effects & Precautions
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="text-yellow-600 font-semibold mr-2">•</span>
                    {remedy.sideEffects.common}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-red-600 font-semibold mr-2">•</span>
                    {remedy.sideEffects.rare}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-blue-600 font-semibold mr-2">•</span>
                    {remedy.sideEffects.precautions}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-1">
              {/* Preparation Time */}
              <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Estimated Preparation Time
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
                  {remedy.preparationTime}
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
              AI-Recommended Alternatives
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
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          AI Confidence: {related.confidence}%
                        </span>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {related.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        {related.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {related.description}
                      </p>

                      {/* Effectiveness Data */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-brand-green">
                            {related.successRate}%
                          </p>
                          <p className="text-gray-600 text-xs">Success Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-brand-green">
                            {related.userFeedback}
                          </p>
                          <p className="text-gray-600 text-xs">User Feedback</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-brand-green">
                            {related.positiveOutcomes}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Positive Outcomes
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex justify-center">
                            {renderStars(related.rating)}
                          </div>
                          <p className="text-gray-600 text-xs">
                            ({related.reviewCount})
                          </p>
                        </div>
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

            {/* Generate Custom Remedy Button */}
            <div className="mt-6 text-center">
              <Button
                variant="contained"
                color="brand"
                size="large"
                className="group"
              >
                <span className="flex items-center">
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
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Generate Custom Remedy
                </span>
              </Button>
              <p className="text-gray-600 text-sm mt-2">
                Use AI to create a personalized remedy based on your needs.
              </p>
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
                    Online sources suggest peppermint tea is often used for
                    headache relief.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    Active ingredients (e.g., menthol) may help with muscle
                    relaxation and pain reduction.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    AI Insight: Based on migraine-related profiles, this remedy
                    may benefit users with light sensitivity or stress-induced
                    migraines.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">○</span>
                  <span className="text-gray-700">
                    Bonus Tip: Try adding a touch of ginger for
                    anti-inflammatory support.
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

export default AIRemedyDetail;