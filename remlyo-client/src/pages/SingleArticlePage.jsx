import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaEye, FaComment, FaTag } from "react-icons/fa";
import DOMPurify from "dompurify";
import { formatDate } from "../utils";
import Navbar from "../components/layout/Navbar";
import { getArticleBySlug } from "../api/articleApi";

const SingleArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchArticle = async () => {
    const res = await getArticleBySlug(slug);
    if (res.success) {
      setArticle(res.article);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!article) {
    return navigate('/404')
  }

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize(article.content);

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

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full">
          <img
            src={article.media.source}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {article.title}
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                {article.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-500" />
              <span>{article.author?.username || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-blue-500" />
              <span>{article.viewsCount} views</span>
            </div>
            <div className="flex items-center gap-2">
              <FaComment className="text-blue-500" />
              <span>{article.commentsCount} comments</span>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              {article.category}
            </div>
            {article.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <FaTag className="text-gray-500" />
                {tag}
              </div>
            ))}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticlePage;
