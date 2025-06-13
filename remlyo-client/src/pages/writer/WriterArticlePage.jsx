import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { deleteArticle, getArticlesByWriterId } from "../../api/articleApi";
import Button from "../../components/common/Button";
import SearchBar from "../../components/common/SearchBar";
import Table from "../../components/common/Table";
import { formatDate } from "../../utils";
import ActionButtonGroup from "../../components/common/ActionButtonGroup";
import { ConfirmModal } from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";

const WriterArticlePage = () => {
  const { user, authToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articles, setArticles] = useState([]);
  const limit = 10;
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await getArticlesByWriterId(
        authToken,
        currentPage,
        limit,
        searchQuery,
        status
      );
      if (res.success) {
        setArticles(res.articles);
        setTotalPages(res.pagination.pages);
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDeleteClick = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const columns = [
    {
      filed: "title",
      header: "Title",
      sortable: false,
      render: (row) => (
        <div className="font-medium text-gray-900">{row.title}</div>
      ),
    },
    {
      filed: "category",
      header: "Category",
      sortable: false,
      render: (row) => (
        <div className="font-medium text-gray-900">{row.category}</div>
      ),
    },
    {
      filed: "createdAt",
      header: "Created At",
      sortable: false,
      render: (row) => (
        <div className="font-medium text-gray-900">
          {formatDate(row.createdAt)}
        </div>
      ),
    },
    {
      field: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <ActionButtonGroup
          viewUrl={`/writer/articles/${row._id}`}
          editUrl={`/writer/articles/${row._id}/edit`}
          onDelete={() => handleDeleteClick(row)}
        />
      ),
    },
  ];

  const handleDeleteConfirm = async () => {
    const res = await deleteArticle(authToken, selectedArticle._id);
    if (res.success) {
      setArticles((prev) => prev.filter(a => a._id !== selectedArticle._id));
      setSelectedArticle(null);
      setShowDeleteModal(false)
    }
  };
  const handlePageChange = () => {
    setCurrentPage((prev) => {
      if (totalPages === prev) {
        return;
      }
      return prev + 1;
    });
  };
  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchQuery]);

  return (
    <DashboardLayout user={user} pageTitle="Articles Managements">
      <div className="mb-6">
        <p className="text-gray-600">Manage Remedy Content here</p>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          All Articles ({articles.length})
        </h2>
        <Button
          variant="contained"
          color="brand"
          className="flex items-center"
          to="/writer/articles/add"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add article
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="w-full md:w-64">
            <SearchBar
              onSearch={handleSearch}
              className="w-full"
              placeholder="Search articles..."
            />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <Table
          columns={columns}
          data={articles}
          isLoading={loading}
          sortable={true}
          defaultSortField="createdAt"
          defaultSortDirection="desc"
        />
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Article"
        message="This will permanently remove the article from the platform. Are you sure you want to delete this article?"
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />
    </DashboardLayout>
  );
};

export default WriterArticlePage;
