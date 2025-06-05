import React, { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getComments } from "../../api/moderatorApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";

// Constants
const ITEMS_PER_PAGE = 10;
const SORT_OPTIONS = {
  NEWEST: "newest",
  MOST_REPORTED: "mostReported",
  MOST_VIEWED: "mostViewed",
  PENDING_REVIEW: "pendingReview",
};

const STATUS_FILTERS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};

const ModeratorCommentPage = () => {
  const { user, authToken } = useAuth();

  // State Management
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [filterByStatus, setFilterByStatus] = useState({
    [STATUS_FILTERS.APPROVED]: false,
    [STATUS_FILTERS.REJECTED]: false,
    [STATUS_FILTERS.PENDING]: false,
  });

  // Sort States
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    order: "desc",
  });

  // UI States
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Memoized filter functions
  const getSelectedStatuses = useCallback(() => {
    return Object.entries(filterByStatus)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status);
  }, [filterByStatus]);

  const handleStatusFilterChange = useCallback((status) => {
    setFilterByStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilterByStatus({
      [STATUS_FILTERS.APPROVED]: false,
      [STATUS_FILTERS.REJECTED]: false,
      [STATUS_FILTERS.PENDING]: false,
    });
    setSortConfig({
      field: "createdAt",
      order: "desc",
    });
    setSearch("");
  }, []);

  const handleSort = useCallback((field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Fetch comments with error handling
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const selectedStatuses = getSelectedStatuses();
      const status = selectedStatuses.length === 1 ? selectedStatuses[0] : "";

      const res = await getComments(
        authToken,
        currentPage,
        ITEMS_PER_PAGE,
        search,
        status,
        sortConfig.field,
        sortConfig.order
      );

      if (res.success) {
        setComments(res.data);
        setTotalPages(res.pagination.totalPages);
      } else {
        setError(res.message || "Failed to fetch comments");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [authToken, currentPage, search, sortConfig, getSelectedStatuses]);

  // Apply filters and sorting
  const filteredComments = useMemo(() => {
    const selectedStatuses = getSelectedStatuses();

    return comments
      .filter(
        (comment) =>
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(comment.status)
      )
      .sort((a, b) => {
        if (sortConfig.field === "createdAt") {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortConfig.order === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.field === "upvoteCount") {
          const votesA = a.upvoteCount || 0;
          const votesB = b.upvoteCount || 0;
          return sortConfig.order === "asc" ? votesA - votesB : votesB - votesA;
        }
        return 0;
      });
  }, [comments, getSelectedStatuses, sortConfig]);

  // Effects
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Render functions
  const renderSortIcon = (field) => {
    if (field !== sortConfig.field) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortConfig.order === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-brand-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-brand-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const renderComment = (comment) => (
    <>
      <tr
        key={comment._id}
        className="bg-white flex justify-between border-b border-gray-100"
      >
        {/* User */}
        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
          <img
            src={comment.userId.profileImage}
            alt={comment.userId.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-800">
            {comment.userId.username}
          </span>
        </td>

        {/* Content */}
        <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 max-w-xs">
          {comment.content}
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded-full capitalize ${
              comment.status === STATUS_FILTERS.APPROVED
                ? "bg-green-100 text-green-700"
                : comment.status === STATUS_FILTERS.REJECTED
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {comment.status}
          </span>
        </td>

        {/* Votes */}
        <td className="px-6 py-4 text-sm text-gray-600">
          {comment.upvoteCount ?? 0}
        </td>

        {/* Date */}
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString()}
        </td>
      </tr>

      {/* Replies (only for approved comments) */}
      {comment.status === STATUS_FILTERS.APPROVED &&
        comment.replies?.length > 0 &&
        comment.replies.map((reply) => (
          <tr key={reply._id} className="bg-gray-50 border-b border-gray-100">
            {/* Indented User Info */}
            <td className="px-6 py-4 whitespace-nowrap pl-12 flex items-center gap-2">
              <img
                src={reply.userId.profileImage}
                alt={reply.userId.username}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-sm text-gray-800">
                {reply.userId.username}
              </span>
            </td>

            {/* Reply Content */}
            <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 max-w-xs">
              {reply.content}
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 text-xs rounded-full capitalize ${
                  reply.status === STATUS_FILTERS.APPROVED
                    ? "bg-green-100 text-green-700"
                    : reply.status === STATUS_FILTERS.REJECTED
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {reply.status}
              </span>
            </td>

            {/* Votes */}
            <td className="px-6 py-4 text-sm text-gray-600">
              {reply.upvoteCount ?? 0}
            </td>

            {/* Date */}
            <td className="px-6 py-4 text-sm text-gray-500">
              {new Date(reply.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
    </>
  );

  const columns = [
    { header: "User", field: "user", sortable: false },
    { header: "Content", field: "content", sortable: false },
    { header: "Status", field: "status", sortable: false },
    { header: "Votes", field: "upvoteCount", sortable: true },
    { header: "Date", field: "createdAt", sortable: true },
  ];

  return (
    <DashboardLayout user={user} pageTitle="Comment Moderation">
      <div className="mb-6">
        <p className="text-gray-600">Manage Comments here</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          All Comments ({comments.length})
        </h2>
      </div>

      <div className="p-4">
        {/* Filters and Search */}
        <div className="flex relative flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <SearchBar
            className="!w-fit"
            onSearch={setSearch}
            placeholder="Search comments..."
          />

          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="default"
              className="flex items-center"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </Button>

            <Button
              variant="outlined"
              color="default"
              className="flex items-center"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
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
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              Sort
            </Button>
          </div>

          {/* Filter Menu */}
          {filterMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    By Comment Status
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(filterByStatus).map(
                      ([status, isChecked]) => (
                        <div key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`status-${status}`}
                            checked={isChecked}
                            onChange={() => handleStatusFilterChange(status)}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="capitalize"
                          >
                            {status}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="text"
                    color="default"
                    onClick={handleFilterReset}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="brand"
                    onClick={() => setFilterMenuOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Sort Menu */}
          {sortMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleSort("createdAt");
                    setSortMenuOpen(false);
                  }}
                >
                  Date
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleSort("upvoteCount");
                    setSortMenuOpen(false);
                  }}
                >
                  Votes
                </li>
              </ul>
            </div>
          )}
        </div>

    {    <div className="bg-white border border-gray-200 rounded-t-lg  overflow-x-auto ">
          <table className="min-w-full table-auto border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    onClick={() => col.sortable && handleSort(col.field)}
                  >
                    <div className="flex items-center gap-1 cursor-pointer">
                      {col.header}
                      {col.sortable && renderSortIcon(col.field)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {filteredComments.map((comment) => {
                const rows = [];

                rows.push(
                  <tr key={comment._id}>
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <img
                        src={comment.userId.profileImage}
                        alt={comment.userId.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-800">
                        {comment.userId.username}
                      </span>
                    </td>

                    {/* Content */}
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 max-w-xs">
                      {comment.content}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full capitalize ${
                          comment.status === STATUS_FILTERS.APPROVED
                            ? "bg-green-100 text-green-700"
                            : comment.status === STATUS_FILTERS.REJECTED
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {comment.status}
                      </span>
                    </td>

                    {/* Votes */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {comment.upvoteCount ?? 0}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );

                // Replies
                if (
                  comment.status === STATUS_FILTERS.APPROVED &&
                  Array.isArray(comment.replies) &&
                  comment.replies.length > 0
                ) {
                  comment.replies.forEach((reply) => {
                    rows.push(
                      <tr key={reply._id} className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap pl-12 flex items-center gap-2">
                          <img
                            src={reply.userId.profileImage}
                            alt={reply.userId.username}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-sm text-gray-800">
                            {reply.userId.username}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 max-w-xs">
                          {reply.content}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full capitalize ${
                              reply.status === STATUS_FILTERS.APPROVED
                                ? "bg-green-100 text-green-700"
                                : reply.status === STATUS_FILTERS.REJECTED
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {reply.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {reply.upvoteCount ?? 0}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  });
                }

                return rows;
              })}
            </tbody>
          </table>
        </div>}

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            maxDisplayedPages={5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorCommentPage;
