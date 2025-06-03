// src/pages/admin/UsersManagementPage.jsx
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
  changeUserRole,
  deleteUser,
  getAllUsers,
  userAccountStatus,
} from "../../api/adminApi";
import { formatDate } from "../../utils";

const UsersManagementPage = () => {
  const { user, authToken } = useAuth();

  // State for users and filters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterByRole, setFilterByRole] = useState("");
  const [filterByLastActiveTime, setFilterByLastActiveTime] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoleValue, setEditRoleValue] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [addUserModal, setAddUserModel] = useState(false);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await getAllUsers(authToken, {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        role: filterByRole,
        lastActive: filterByLastActiveTime,
      });
      if (res.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.pagination.totalPages);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery, filterByRole, filterByLastActiveTime]);

  // Table columns definition
  const columns = [
    {
      field: "name",
      header: "Name & Username",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <img
            src={row.profileImage}
            alt={row.name}
            className="w-8 h-8 rounded-full mr-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/32?text=👤";
            }}
          />
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.username}</div>
          </div>
        </div>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "accessLevel",
      header: "Role",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex !capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.accessLevel === "admin"
              ? "bg-blue-100 text-blue-800"
              : row.role === "Moderator"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.accessLevel}
        </span>
      ),
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge className="!capitalize" status={row?.status} />
      ),
    },
    {
      field: "lastLogin",
      header: "Last Active",
      sortable: true,
      render: (row) => formatDate(row.lastLogin),
    },
    {
      field: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <ActionButtonGroup
          viewUrl={`/admin/users/${row._id}`}
          onEdit={() => handleEditClick(row)}
          onDelete={() => handleDeleteClick(row)}
          extraActions={[
            {
              title: "Suspend Account",
              onClick: () => handleSuspendClick(row),
              icon: (
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
              ),
              className: "text-orange-500 hover:text-orange-700",
            },
            {
              title: "Warn User",
              onClick: () => handleWarnClick(row),
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500"
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
              ),
              className: "text-yellow-500 hover:text-yellow-700",
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
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilterByRole({
      admin: false,
      moderator: false,
      user: false,
    });
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setFilterByRole(e.target.value);
  };

  // Handle delete click
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Handle suspend click
  const handleSuspendClick = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  // Handle warn click
  const handleWarnClick = (user) => {
    setSelectedUser(user);
    setShowWarnModal(true);
  };

  // Handle edit click
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditRoleValue(user.accessLevel);
    setShowEditModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    const res = await deleteUser(authToken, selectedUser._id);
    if (res.success) {
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } else {
    }
  };

  // Handle suspend confirm
  const handleSuspendConfirm = async () => {
    const res = await userAccountStatus(authToken, {
      message: suspensionReason,
      status: "suspend",
      id: selectedUser._id,
    });
    if (res.success) {
      setUsers(
        users.map((u) => {
          if (u._id == res.data.userId) {
            return { ...u, status: "suspended" };
          }
          return u;
        })
      );

      // Close modal and reset values
      setShowSuspendModal(false);
      setSelectedUser(null);
      setSuspensionReason("");
    }
  };

  // Handle warn confirm
  const handleWarnConfirm = async () => {
    const res = await userAccountStatus(authToken, {
      message: suspensionReason,
      status: "warning",
      id: selectedUser._id,
    });
    if (res.success) {
      setUsers(
        users.map((u) => {
          if (u._id == res.data.userId) {
            return { ...u, status: res.data.status };
          }
          return u;
        })
      );
      setShowWarnModal(false);
      setSelectedUser(null);
      setWarningMessage("");
    }
  };

  // Handle edit confirm

  const handleFilterByLastActiveTime = (e) => {
    setFilterByLastActiveTime(e.target.value);
  };

  const handleEditConfirm = async () => {
    const res = await changeUserRole(authToken, {
      id: selectedUser._id,
      role: editRoleValue,
    });
    if (res.success) {
      setUsers(
        users.map((u) =>
          u._id === selectedUser._id
            ? { ...u, accessLevel: res.data.newRole }
            : u
        )
      );

      setShowEditModal(false);
      setSelectedUser(null);
    } else {
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Users Management" user={user}>
      <div className="mb-6">
        <p className="text-gray-600">
          Manage team members and their role permission here
        </p>
      </div>

      {/* Users Count and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          All users ({users.length})
        </h2>
        <Button
          variant="contained"
          color="brand"
          className="flex items-center"
          to={'/admin/users/add'}
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
          Add user
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-64">
          <SearchBar
            onSearch={handleSearch}
            className="w-full"
            placeholder="Search users..."
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
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-4">
                {/* By Role */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">By Role</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <select
                        id="role-filter"
                        onChange={handleRoleFilterChange}
                        value={filterByRole}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                        defaultValue=""
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                        <option value="writer">Writer</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Last Active */}
                <div className="mb-4">
                  <label
                    htmlFor="last-active"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Last Active
                  </label>
                  <input
                    type="date"
                    id="last-active"
                    value={filterByLastActiveTime}
                    onChange={handleFilterByLastActiveTime}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
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
      </div>

      {/* Responsive Table */}
      <div className="mb-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <Table
            columns={columns}
            data={users}
            isLoading={loading}
            sortable={true}
            defaultSortField="name"
            defaultSortDirection="asc"
          />
        </div>
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
        title="Delete User"
        message={`Are you sure you want to delete user (${selectedUser?.username})? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        danger={true}
      />

     

      {/* Suspend User Modal */}
      <Modal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        title="Suspend User Account"
        size="md"
      >
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Please provide a reason for suspending this user's account. This
            information will be stored for administrative purposes.
          </p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            rows={4}
            placeholder="Enter suspension reason..."
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outlined"
            color="default"
            onClick={() => setShowSuspendModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="default"
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSuspendConfirm}
            disabled={!suspensionReason.trim()}
          >
            Suspend Account
          </Button>
        </div>
      </Modal>

      {/* Warn User Modal */}
      <Modal
        isOpen={showWarnModal}
        onClose={() => setShowWarnModal(false)}
        title="Send Warning to User"
        size="md"
      >
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This will send a warning message to the user. Please provide details
            about the warning.
          </p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            rows={4}
            placeholder="Enter warning message..."
            value={warningMessage}
            onChange={(e) => setWarningMessage(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outlined"
            color="default"
            onClick={() => setShowWarnModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="default"
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={handleWarnConfirm}
            disabled={!warningMessage.trim()}
          >
            Send Warning
          </Button>
        </div>
      </Modal>

      {/* Edit User Role Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User Role"
        size="sm"
      >
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Change the role for user {selectedUser?.name}.
          </p>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Role
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              value={editRoleValue}
              onChange={(e) => setEditRoleValue(e.target.value)}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outlined"
            color="default"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="brand" onClick={handleEditConfirm}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersManagementPage;
