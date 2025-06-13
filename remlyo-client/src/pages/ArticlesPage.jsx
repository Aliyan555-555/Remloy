import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import SearchBar from "../components/common/SearchBar";
import { getAllArticles } from "../api/articleApi";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import Button from "../components/common/Button";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchArticles = async () => {
    const res = await getAllArticles(currentPage, limit, search);
    if (res.success) {
      setArticles(res.articles);
      setTotalPages(res.pagination.pages);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // You would typically fetch data for the new page here
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    fetchArticles();
  }, [currentPage, search]);

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

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Header with fixed search bar alignment */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 md:self-center">
              Remlyo Articles
            </h1>

            <div className="w-full md:w-64 lg:w-80">
              <SearchBar
                onSearch={handleSearch}
                className="w-full"
                placeholder="Search articles..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={article.media.source}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Turmeric+Tea";
                    }}
                  />
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {article.shortDescription}
                  </p>

                  <div className="mt-auto">
                    <div className="mt-auto">
                      <Button
                        variant="readMore"
                        to={`/articles/${article.slug}`}
                        fullWidth
                      >
                        View Article
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default ArticlesPage;
