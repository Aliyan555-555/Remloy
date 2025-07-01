// src/pages/AIRemedyDetail.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { createComment, getAIfeedback, getAllCommentsByRemedyId, getRemedyById } from "../api/remediesApi";
import { useAuth } from "../contexts/AuthContext";
import AIFeedback from "../components/common/AIFeedback";
import ReviewPopup from "../components/common/ReviewPopup";
import { formatDate } from "../utils";
import CommentItem from "../components/common/CommentItem";
import AccessDeniedComponent from './../components/common/AccessDeniedComponent';

const AIRemedyDetail = () => {
  const { remedyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ailmentId = searchParams.get("id");
  const [feedbackError, setFeedbackError] = useState(false);
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showAIInsightPopup, setShowAIInsightPopup] = useState(false);
  const { authToken, refresh, addOrRemoveSavedRemedies, user } = useAuth();
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isTry, setIsTry] = useState(false);
  const [tryLoading, setTryLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const fetchRemedyDetails = async () => {
    try {
      setLoading(true);
      // Simulating API call
      const res = await getRemedyById(authToken, remedyId, ailmentId);
      console.log(res);
      if (res && res.success) {
        setRemedy(res.remedy);
      } else {
        setAccessDenied(true);
        setAccessDeniedMessage(res.message);
      }
    } finally {
      setLoading(false);
      await refresh();
    }
  };
  const fetchComments = async () => {
    const res = await getAllCommentsByRemedyId(authToken, remedyId);
    if (res.success) {
      // Sort comments by createdAt descending (newest first)
      const sorted = [...res.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sorted);
    }
  };

  useEffect(() => {
    fetchRemedyDetails();
    fetchComments();
  }, [remedyId]);
  const fetchAiFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await getAIfeedback(authToken, remedyId);
      if (res.success) {
        setFeedbackData(res.feedbackData);
      } else {
        setFeedbackError(true);
      }
    } catch (error) {
      setFeedbackError(true);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    fetchAiFeedback();
  }, []);

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
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentData = {
      remedyId,
      content: newComment,
      parentCommentId: null,
    };
    const res = await createComment(authToken, commentData);
    if (res.success) {
      // Add new comment to the top
      setComments((prev) => [res.comment, ...prev]);
      setNewComment("");
    }
  };

  // Recursively insert a reply into the correct place in the comments tree
  const insertReply = (comments, parentCommentId, newReply) => {
    return comments.map((comment) => {
      if (comment._id === parentCommentId) {
        return {
          ...comment,
          replies: comment.replies
            ? [newReply, ...comment.replies]
            : [newReply],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: insertReply(comment.replies, parentCommentId, newReply),
        };
      } else {
        return comment;
      }
    });
  };

  // Handle reply submission
  const handleReplySubmit = async (
    e,
    parentCommentId,
    replyContent,
    resetReplyContent
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    const commentData = {
      remedyId,
      content: replyContent,
      parentCommentId,
    };
    const res = await createComment(authToken, commentData);
    if (res.success) {
      setComments((prev) => insertReply(prev, parentCommentId, res.comment));
      setReplyingTo(null);
      resetReplyContent("");
    }
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

  if (accessDenied) {
    return (
      <div className="max-w-screen flex items-center justify-center  h-screen">
        <AccessDeniedComponent message={accessDeniedMessage} />
      </div>
    );
  }

  const handleAddAndRemoveInTry = async () => {
    try {
      if (tryLoading) return;
      setTryLoading(true);
      const res = await addOrRemoveSavedRemedies(remedyId, "to-try");
      if (res) {
        setIsTry(true);
      } else {
        setIsTry(false);
      }
    } finally {
      setTryLoading(false);
    }
  };
  const handleAddAndRemoveInFavorite = async () => {
    try {
      setFavoriteLoading(true);
      const res = await addOrRemoveSavedRemedies(remedyId, "favorite");
      if (res) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

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
              AI Generated
            </span>
          </div>

          {/* Remedy Title - CENTERED */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {remedy.name}
          </h1>

          {/* Generated Date Information - CENTERED */}
          <div className="text-gray-600 text-sm mb-4 text-center">
            AI-Generated Personalized Remedy - Generated on{" "}
            {formatDate(remedy.createAt)}
            {remedy.updatedAt &&
              `, last updated on ${formatDate(remedy.updatedAt)}`}
          </div>

          {/* Rating and Actions - RESPONSIVE (Similar to AlternativeRemedyDetail) */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center mb-3">
              <div className="flex mr-2">
                {renderStars(remedy.averageRating)}
              </div>
              <span className="text-gray-600 text-sm">
                ({remedy.reviewCount})
              </span>
              <button
                onClick={() => setIsReviewOpen(true)}
                className="ml-2 text-brand-green underline text-sm"
              >
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
                variant={isFavorite ? "contained" : "outlined"}
                color="brand"
                size="small"
                onClick={handleAddAndRemoveInFavorite}
                className={`flex items-center ${
                  isFavorite ? "bg-brand-green text-white" : ""
                } min-w-[140px] justify-center`}
                disabled={favoriteLoading || tryLoading}
              >
                {favoriteLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
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
                    {isFavorite ? "Remove from favorite" : "Add to favorite"}
                  </>
                )}
              </Button>

              <Button
                variant={isTry ? "contained" : "outlined"}
                color="brand"
                onClick={handleAddAndRemoveInTry}
                size="small"
                className={`${
                  isTry ? "bg-brand-green text-white" : ""
                } flex items-center min-w-[120px] justify-center`}
                disabled={tryLoading || favoriteLoading}
              >
                {tryLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
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
                    {isTry ? "Remove from Try" : "Try"}
                  </>
                )}
              </Button>

              <Button
                variant="outlined"
                color="brand"
                size="small"
                className="flex items-center"
                disabled={feedbackLoading}
                title={
                  feedbackLoading ? "Ai insights loading..." : "Ai insights"
                }
                onClick={toggleAIInsightPopup}
              >
                {feedbackLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                    </svg>
                    What does Remi think?
                  </>
                )}
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
                  src={remedy.media?remedy.media.source:"https://placehold.co/600x400?text=Remlyo"}
                  alt={remedy.name}
                  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src ="https://placehold.co/600x400?text=Remlyo"
                  }}
                />
              </div>

              {!feedbackLoading && (
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    AI Confidence Score
                  </h2>
                  <div className="flex items-center mb-3">
                    <div className="bg-brand-green rounded-full text-white px-3 py-1 text-sm font-medium mr-3">
                      {feedbackData.aiSummary.confidenceScore}% Confidence
                    </div>
                    <p className="text-gray-600 text-sm italic">
                      Based on your Health & Lifestyle Profile
                    </p>
                  </div>
                  <p className="text-gray-700">
                    {feedbackData.aiSummary.confidenceExplanation}
                  </p>
                </div>
              )}

              {/* Why This Was Recommended */}
              {!feedbackLoading && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Why This Was Recommended?
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {feedbackData.aiSummary.recommendationReason}
                  </p>

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
              )}
              {/* Effectiveness Data */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Effectiveness Data
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-4">
                  <div className="bg-white rounded-lg shadow-md p-5">
                    <p className="text-3xl font-bold text-brand-green">
                      {remedy.ratings.successRate || 0}%
                    </p>
                    <p className="text-gray-600 text-sm mt-1">Success Rate</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-5">
                    <p className="text-3xl font-bold text-brand-green">
                      {remedy.ratings.totalReviews}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">User Feedback</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-5">
                    <p className="text-3xl font-bold text-brand-green">
                      {remedy.ratings.positiveOutcomes ||0}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Positive Outcomes
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Success Rate: </span>
                  {0}
                </p>
              </div>

              {/* remedy content */}
              <div className="mb-8">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: remedy.content }}
                />
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Instructions
                </h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: remedy.instructions }}
                />
              </div>

              {/* Potential Side Effects & Precautions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Potential Side Effects & Precautions
                </h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: remedy.sideEffects }}
                />
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
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: remedy.ingredients }}
                />
              </div>

              {/* Equipment */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Equipment
                </h3>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: remedy.equipments }}
                />
              </div>
            </div>
          </div>

          {/* Related Remedies */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI-Recommended Alternatives
            </h2>
            <div className="grid grid-cols-1 gap-6"></div>

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
            {/* <div className="flex justify-end mb-4">
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
            </div> */}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    onReplyClick={() => setReplyingTo(comment._id)}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    handleReplySubmit={handleReplySubmit}
                    depth={0}
                  />
                ))
              ) : (
                <div className="w-full py-7 border border-gray-400 text-center rounded-lg">
                  No Comments yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Insight Popup  */}
      {showAIInsightPopup && (
        <AIFeedback
          toggleAIInsightPopup={toggleAIInsightPopup}
          loading={feedbackLoading}
          content={feedbackData.feedbackText}
          error={feedbackError}
        />
      )}
      {isReviewOpen && (
        <ReviewPopup
          isOpen={isReviewOpen}
          setAverageRating={(averageRating, reviewCount) =>
            setRemedy((prev) => ({ ...prev, averageRating, reviewCount }))
          }
          onClose={() => setIsReviewOpen(false)}
          remedyId={remedyId}
        />
      )}
      <Footer />
    </div>
  );
};

export default AIRemedyDetail;
