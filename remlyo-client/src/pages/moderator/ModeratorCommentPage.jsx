import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getComments } from "../../api/moderatorApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";

const ModeratorCommentPage = () => {
  const { user, authToken } = useAuth();
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getComments(
        authToken,
        currentPage,
        itemsPerPage,
        search,
        statusFilter !== "all" ? statusFilter : "",
        sortBy,
        sortOrder
      );
      if (res.success) {
        setComments(res.data);
        setTotalPages(res.pagination.totalPages);
      } else {
        console.error("Fetch failed:", res.message);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [search, statusFilter, sortBy, sortOrder, currentPage]);

  const groupedComments = useMemo(() => {
    const map = new Map();
    comments.forEach((comment) => {
      map.set(comment._id, { ...comment, replies: [] });
    });

    const rootComments = [];

    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = map.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(map.get(comment._id));
        }
      } else {
        rootComments.push(map.get(comment._id));
      }
    });

    return rootComments;
  }, [comments]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (field !== sortField) {
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

    return sortDirection === "asc" ? (
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

  const columns = [
    { header: "User", field: "user", sortable: false },
    { header: "Content", field: "content", sortable: false },
    { header: "Status", field: "status", sortable: false },
    { header: "Votes", field: "upvoteCount", sortable: true },
    { header: "Date", field: "createdAt", sortable: true },
  ];

  const renderNestedComments = (commentList) =>
    commentList.map((comment) => (
      <div
        key={comment._id}
        className="bg-white shadow  p-4  border border-gray-200"
      >
        {/* Parent Comment */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-gray-900 font-medium">{comment.user?.name}</p>
            <p className="text-gray-700">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 text-sm mt-2 md:mt-0">
            <span
              className={`px-2 py-1 rounded-full capitalize ${
                comment.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : comment.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {comment.status}
            </span>
            <span className="text-gray-600">
              {comment.upvoteCount ?? 0} votes
            </span>
            <span className="text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Replies */}
        {comment.status === "approved" && comment.replies.length > 0 && (
          <div className="pl-6 border-l-2 border-gray-200 space-y-4 mt-4">
            {comment.replies.map((reply) => (
              <div
                key={reply._id}
                className="bg-gray-50 p-3 rounded-md shadow-sm border"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-2 md:mb-0">
                    <p className="text-gray-800 font-medium">
                      {reply.user?.name}
                    </p>
                    <p className="text-gray-700">{reply.content}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-2 md:mt-0">
                    <span
                      className={`px-2 py-1 rounded-full capitalize ${
                        reply.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : reply.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {reply.status}
                    </span>
                    <span className="text-gray-600">
                      {reply.upVotes ?? 0} votes
                    </span>
                    <span className="text-gray-500">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ));

  return (
    <DashboardLayout user={user} pageTitle="Comment Moderation">
      <div className="p-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search comments..."
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
            className="border px-3 py-2 rounded-md w-full md:w-1/3"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value);
            }}
            className="border px-3 py-2 rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Sortable Table Header */}
        <div className="bg-white border border-gray-200 rounded-t-lg  overflow-x-auto ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      col.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => col.sortable && handleSort(col.field)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.header}</span>
                      {col.sortable && renderSortIcon(col.field)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Comments */}
        {loading ? (
          <LoadingSpinner />
        ) : groupedComments.length === 0 ? (
          <p className="text-gray-500">No comments found.</p>
        ) : (
          <div className="">
            {renderNestedComments(groupedComments)}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          totalPages={totalPages}
          maxDisplayedPages={5}
        />
      </div>
    </DashboardLayout>
  );
};

export default ModeratorCommentPage;
