import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Table from "../../components/common/Table";
import { getFlags } from "../../api/moderatorApi";

// Temporary mock data based on new schema
const demoFlags = [
  {
    _id: "1",
    contentType: "Remedy",
    contentTitle: "Turmeric for Inflammation",
    flaggedBy: { _id: "user123", username: "user123" },
    reason: "Contains misleading medical claims",
    note: "User says this may cause confusion.",
    createdAt: "2025-06-03T10:15:00Z",
    status: "active",
    contentId: "remedy123",
  },
  {
    _id: "2",
    contentType: "Review",
    contentTitle: "This remedy is stupid",
    flaggedBy: { _id: "user456", username: "user456" },
    reason: "Inappropriate language",
    createdAt: "2025-06-02T14:22:00Z",
    status: "active",
    contentId: "comment456",
  },
  {
    _id: "3",
    contentType: "Remedy",
    contentTitle: "Garlic for Cold",
    flaggedBy: { _id: "user789", username: "user789" },
    reason: "Plagiarized content",
    createdAt: "2025-06-01T08:00:00Z",
    status: "resolved",
    contentId: "remedy789",
  },
];

const ModeratorFlagPage = () => {
  const { user, authToken } = useAuth();
  const [search, setSearch] = useState("");
  const [flags, setFlags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchFlags = async () => {
    const res = await getFlags(authToken, currentPage, 10, search);
    if (res && res.success) {
      setFlags(res.data);
      setTotalPages(res.pagination.totalPages);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, [currentPage, search]);

  const handleResolve = (id) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag._id === id ? { ...flag, status: "resolved" } : flag
      )
    );
  };

  const handleDismiss = (id) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag._id === id ? { ...flag, status: "dismissed" } : flag
      )
    );
  };

  const handleSuspendUser = (userId) => {
    alert(`User ${userId} suspended (demo)`);
  };

  const columns = [
    { header: "Type", field: "contentType" },
    {
      header: "Content",
      field: "contentId.title",
      render: (row) => ` ${row.contentId.name}`,
    },
    {
      header: "Flagged By",
      field: "flaggedBy.username",
      render: (row) => `@${row.flaggedBy?.username || "Unknown"}`,
    },
    { header: "Reason", field: "reason" },
    {
      header: "Note",
      field: "note",
      render: (row) => row.note || "—",
    },
    {
      header: "Date",
      field: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      field: "status",
      render: (row) => {
        const statusStyles = {
          active: "bg-yellow-100 text-yellow-700",
          resolved: "bg-green-100 text-green-700",
          dismissed: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              statusStyles[row.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      field: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className={" text-green-500 hover:text-green-700"}
            title={"Approved"}
            onClick={() => handleResolve(row._id)}
            aria-label={"Approved"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>

          <button
            onClick={() => handleDismiss(row._id)}
            disabled={row.status !== "active"}
            title="Dismiss"
            className={" text-green-500 hover:text-green-700"}
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
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
          <button
            aria-label="Suspend User"
            onClick={() => handleSuspendUser(row.flaggedBy._id)}
            title="Suspend User"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} pageTitle="Flagged Content Moderation">
      <div className="mb-6">
        <p className="text-gray-600">
          Review all content flagged by users for inappropriate or incorrect
          information.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center gap-2">
          Flagged Items ({flags.length})
        </h2>
        <SearchBar
          className="!w-fit"
          placeholder="Search flagged content..."
          onSearch={(e) => setSearch(e)}
        />
      </div>

      <Table
        columns={columns}
        data={flags}
        sortable={true}
        defaultSortField="createdAt"
        defaultSortDirection="desc"
        emptyMessage="No flagged content found."
        className="text-sm"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={() => setCurrentPage((p) => p + 1)}
        className="mt-6"
      />
    </DashboardLayout>
  );
};

export default ModeratorFlagPage;
