// src/pages/AlternativeRemedyDetail.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { formatDate } from "../utils";
import {
  createComment,
  getAIfeedback,
  getAllCommentsByRemedyId,
  getRemedyById,
} from "../api/remediesApi";
import { useAuth } from "../contexts/AuthContext";
import AIFeedback from "../components/common/AIFeedback";
import { saveRemedy } from "../api/userApi";
import ReviewPopup from "../components/common/ReviewPopup";
import CommentItem from "../components/common/CommentItem";
import AccessDeniedComponent from "../components/common/AccessDeniedComponent";

const AlternativeRemedyDetail = () => {
  const { remedyId } = useParams();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [feedbackError, setFeedbackError] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const ailmentId = searchParams.get("id");
  const { authToken, user, addOrRemoveSavedRemedies, refresh } = useAuth();
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
  const [content, setContent] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isTry, setIsTry] = useState(false);
  const [tryLoading, setTryLoading] = useState(false);

  useEffect(() => {
    if (user && user.saveRemedies && remedyId) {
      setIsFavorite(
        user.saveRemedies.some(
          (item) =>
            item.type === "favorite" &&
            item.remedy &&
            item.remedy._id === remedyId
        )
      );
      setIsTry(
        user.saveRemedies.some(
          (item) =>
            item.type === "to-try" &&
            item.remedy &&
            item.remedy._id === remedyId
        )
      );
    }
  }, []);

  // Fetch remedy details
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
        setContent(res.feedback);
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
            <span className="bg-purple-500 capitalize text-white px-4 py-1 rounded-full text-sm">
              {remedy.type}
            </span>
          </div>

          {/* Remedy Title - CENTERED */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {remedy.name}
          </h1>

          {/* Posted Information - CENTERED */}
          <div className="text-gray-600 text-sm mb-4 text-center">
            Posted by {remedy.createdBy.username} on{" "}
            {formatDate(remedy.createdAt)}
            {remedy.updatedDate &&
              ` (Last updated on ${formatDate(remedy.updatedAt)})`}
            {/* {remedy.verifiedPractitioner && (
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                Verified Practitioner
              </span>
            )} */}
          </div>

          {/* Rating and Actions - RESPONSIVE */}
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
          <p className="text-gray-700 mb-6">{remedy.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Remedy Image */}
              <div className="mb-6">
                <img
                  src={
                    remedy
                      ? remedy.media.source
                      : "https://placehold.co/600x400?text=Remlyo"
                  }
                  alt={remedy.name}
                  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=Remlyo";
                  }}
                />
              </div>

              <div
                className=" prose"
                dangerouslySetInnerHTML={{ __html: remedy.content }}
              />
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
                  {remedy.preparationTime}
                </p>
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Ingredients
                </h3>
                <div
                  className=" prose"
                  dangerouslySetInnerHTML={{ __html: remedy.ingredients }}
                />
              </div>

              {/* Equipment */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Equipment
                </h3>
                <div
                  className=" prose"
                  dangerouslySetInnerHTML={{ __html: remedy.equipments }}
                />
              </div>
            </div>
          </div>

          {/* Related Remedies */}
          {/* <div className="mb-10">
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
          {/* <div className="mb-4">
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
                      </div> */}
          {/* 
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
          </div> */}

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

      {showAIInsightPopup && (
        <AIFeedback
          toggleAIInsightPopup={toggleAIInsightPopup}
          loading={feedbackLoading}
          content={content}
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

export default AlternativeRemedyDetail;
