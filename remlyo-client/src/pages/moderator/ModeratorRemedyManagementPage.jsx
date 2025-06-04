// src/pages/admin/RemedyManagementPage.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import SearchBar from "../../components/common/SearchBar";
import ActionButtonGroup from "../../components/common/ActionButtonGroup";
import StatusBadge from "../../components/common/StatusBadge";
import Modal, { ConfirmModal } from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteRemedy,
  getAllRemedies,
  moderateRemedy,
} from "../../api/adminApi";
import { formatDate } from "../../utils";

const ModeratorRemedyManagementPage = () => {
  const { user, authToken } = useAuth();

  // State for remedies and filters
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterByStatus, setFilterByStatus] = useState({
    approved: false,
    rejected: false,
    pending: false,
  });
  const [filterByType, setFilterByType] = useState({
    community: false,
    alternative: false,
    pharmaceutical: false,
    ai: false,
  });
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Fetch remedies data 
  const fetchRemedies = async () => {
      setLoading(true);
      const res = await getAllRemedies(authToken, {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        type: filterByType,
        status: filterByStatus,
      });
      const { success, totalPages, remedies, message } = res;
      if (success) {
        setRemedies(remedies);
        setTotalPages(totalPages); // Assuming 10 remedies per page
        setLoading(false);
      } else {
        console.error("Failed to fetch remedies:", message);
      }
    };
  useEffect(() => {
   

    fetchRemedies();
  }, [currentPage, searchQuery, selectedCategory]);

  // Table columns definition
  const columns = [
    {
      field: "name",
      header: "Title",
      sortable: true,
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      field: "category",
      header: "Category",
      sortable: true,
    },
    {
      field: "createdBy",
      header: "Created by",
      sortable: true,
      render: (row) => (
        <div className="flex items-center ">
          <img
            src={row.createdBy?.profileImage || `/images/avatars/user1.jpg`}
            alt={row.createdBy?.name || "User Avatar"}
            className="w-6 h-6 rounded-full mr-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/24?text=👤";
            }}
          />
          <div className="flex flex-col">
            <span>{row.createdBy.email}</span>
            <span className="text-gray-500 text-xs ml-1">
              @{row.createdBy.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      header: "Created at",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      field: "moderationStatus",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.moderationStatus} />,
    },
    {
      field: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <ActionButtonGroup
          viewUrl={`/admin/remedies/${row._id}`}
          editUrl={`/admin/remedies/${row._id}/edit`}
          onDelete={() => handleDeleteClick(row)}
          extraActions={[
            {
              title: "Approve Remedy",
              onClick: () => handleApproveRemedy(row),
              icon: (
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
              ),
              className: "text-green-500 hover:text-green-700",
            },
            {
              title: "Reject Remedy",
              onClick: () => handleRejectClick(row),
              icon: (
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
              ),
              className: "text-red-500 hover:text-red-700",
            },
          ]}
        />
      ),
    },
  ];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real app, you would fetch data for the new page
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // In a real app, you would fetch data with the search query
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilterByStatus({
      approved: false,
      rejected: false,
      pending: false,
    });
    setFilterByType({
      community: false,
      alternative: false,
      pharmaceutical: false,
      ai: false,
    });
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setFilterByStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Handle type filter change
  const handleTypeFilterChange = (type) => {
    setFilterByType((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Handle delete click
  const handleDeleteClick = (remedy) => {
    setSelectedRemedy(remedy);
    setShowDeleteModal(true);
  };

  // Handle reject click
  const handleRejectClick = (remedy) => {
    setSelectedRemedy(remedy);
    setShowRejectModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    const res = await deleteRemedy(authToken, selectedRemedy._id);
    if (res.success) {
      // Remove the deleted remedy from the state
      setRemedies(remedies.filter((r) => r._id !== selectedRemedy._id));
      setShowDeleteModal(false);
      setSelectedRemedy(null);
    }
  };

  // Handle reject confirm
  const handleRejectConfirm = async () => {
    const res = await moderateRemedy(authToken, selectedRemedy._id, {
      status: "rejected",
      rejectionReason,
    });

    if (res.success) {
      setRemedies(
        remedies.map((r) =>
          r._id === selectedRemedy._id
            ? { ...r, moderationStatus: "rejected" }
            : r
        )
      );

      // Close modal and reset values
      setShowRejectModal(false);
      setSelectedRemedy(null);
      setRejectionReason("");
    }
  };

  // Handle approve remedy
  const handleApproveRemedy = async (remedy) => {
    const res = await moderateRemedy(authToken, remedy._id, {
      status: "approved",
      rejectionReason: "", // No rejection reason for approval
    });

    if (res.success) {
      setRemedies(
        remedies.map((r) =>
          r._id === remedy._id ? { ...r, moderationStatus: "approved" } : r
        )
      );
    }
  };

  return (
    <DashboardLayout pageTitle="Remedy Management" user={user}>
      <div className="mb-6">
        <p className="text-gray-600">Manage Remedy Content here</p>
      </div>

      {/* Remedies Count and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          All Remedies ({remedies.length})
        </h2>
        <Button
          variant="contained"
          color="brand"
          className="flex items-center"
          to="/admin/remedies/add"
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
          Add remedy
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-64">
          <SearchBar
            onSearch={handleSearch}
            className="w-full"
            placeholder="Search remedies..."
          />
        </div>

        {/* Filters Button and Dropdown */}
        <div className="relative">
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

          {filterMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-4">
                {/* By Remedy Status */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    By Remedy Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="status-approved"
                        checked={filterByStatus.approved}
                        onChange={() => handleStatusFilterChange("approved")}
                        className="mr-2"
                      />
                      <label htmlFor="status-approved">Approved Remedies</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="status-pending"
                        checked={filterByStatus.pending}
                        onChange={() => handleStatusFilterChange("pending")}
                        className="mr-2"
                      />
                      <label htmlFor="status-pending">Pending review</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="status-rejected"
                        checked={filterByStatus.rejected}
                        onChange={() => handleStatusFilterChange("rejected")}
                        className="mr-2"
                      />
                      <label htmlFor="status-rejected">Rejected</label>
                    </div>
                  </div>
                </div>

                {/* By Remedy Type */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    by Remedy Type
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="type-community"
                        checked={filterByType.community}
                        onChange={() => handleTypeFilterChange("community")}
                        className="mr-2"
                      />
                      <label htmlFor="type-community">Community Remedies</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="type-alternative"
                        checked={filterByType.alternative}
                        onChange={() => handleTypeFilterChange("alternative")}
                        className="mr-2"
                      />
                      <label htmlFor="type-alternative">
                        Alternative Remedies
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="type-pharmaceutical"
                        checked={filterByType.pharmaceutical}
                        onChange={() =>
                          handleTypeFilterChange("pharmaceutical")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="type-pharmaceutical">
                        Pharmaceuticals Remedies
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="type-ai"
                        checked={filterByType.ai}
                        onChange={() => handleTypeFilterChange("ai")}
                        className="mr-2"
                      />
                      <label htmlFor="type-ai">AI Remedies</label>
                    </div>
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
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
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
            {sortOption === "newest"
              ? "Most recent"
              : sortOption === "mostReported"
              ? "Most reported"
              : sortOption === "mostViewed"
              ? "Most viewed"
              : "Sort By"}
          </Button>

          {sortMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "newest" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("newest");
                    setSortMenuOpen(false);
                  }}
                >
                  Most recent
                </li>
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "mostReported" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("mostReported");
                    setSortMenuOpen(false);
                  }}
                >
                  Most reported
                </li>
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "mostViewed" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("mostViewed");
                    setSortMenuOpen(false);
                  }}
                >
                  Most viewed
                </li>
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "pendingReview" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("pendingReview");
                    setSortMenuOpen(false);
                  }}
                >
                  Pending review
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Remedies Table */}
      <div className="mb-6">
        <Table
          columns={columns}
          data={remedies}
          isLoading={loading}
          sortable={true}
          defaultSortField="createdAt"
          defaultSortDirection="desc"
        />
      </div>

      {/* Pagination */}
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
        title="Delete Remedy"
        message="This will permanently remove the remedy from the platform. Are you sure you want to delete this remedy?"
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />

      {/* Reject Remedy Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Remedy"
        size="md"
      >
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Please provide a reason for rejecting this remedy. This will be sent
            to the user.
          </p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outlined"
            color="default"
            onClick={() => setShowRejectModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="default"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleRejectConfirm}
            disabled={!rejectionReason.trim()}
          >
            Reject Remedy
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ModeratorRemedyManagementPage;
