import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { deleteAilment, getAllAilments } from "../../api/ailmentsApi";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import ActionButtonGroup from "../../components/common/ActionButtonGroup";
import { ConfirmModal } from "../../components/common/Modal";

const AlimentManagementPage = () => {
  const { user,authToken } = useAuth();

  const [ailments, setAilments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalAilments, setTotalAilments] = useState(0);
  const [selectedAilment, setSelectedAilment ] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchAilments = async () => {
    try {
      const res = await getAllAilments({
        page: currentPage,
        limit: 10,
        search: searchQuery,
      });
      const { success, ailments, pagination } = res;
      if (success) {
        setAilments(ailments);
        setTotalPages(pagination.pages);
        setTotalAilments(pagination.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAilments();
  }, [currentPage, searchQuery]);

  const handleDeleteClick = (ailment) => {
    setSelectedAilment(ailment);
    setShowDeleteModal(true);
  };

  const columns = [
    {
      field: "name",
      header: "Name",
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
      field: "createdAt",
      header: "Created at",
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      field: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <ActionButtonGroup
          viewUrl={`/admin/ailments/${row._id}`}
          editUrl={`/admin/ailments/${row._id}/edit`}
          onDelete={() => handleDeleteClick(row)}
        />
      ),
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real app, you would fetch data for the new page
  };

  const handleDeleteConfirm = async () => {
    const res = await deleteAilment(authToken,selectedAilment._id);
    if (res.success) {
      // Remove the deleted remedy from the state
      setAilments(ailments.filter((r) => r._id !== selectedAilment._id));
      setShowDeleteModal(false);
      setSelectedRemedy(null);
    }
  }

  return (
    <DashboardLayout user={user} pageTitle="Ailments Management">
      <div className="mb-6">
        <p className="text-gray-600">Manage Ailments Content here</p>
      </div>

      {/* Ailments Count and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          All Ailments ({totalAilments})
        </h2>
        <Button
          variant="contained"
          color="brand"
          className="flex items-center"
          to="/admin/ailments/add"
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
          Add Ailment
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-64">
          <SearchBar
            onSearch={handleSearch}
            className="w-full"
            placeholder="Search ailments..."
          />
        </div>
      </div>

      {/* Ailments tables */}
      <div className="mb-6">
        <Table
          columns={columns}
          data={ailments}
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
        title="Delete Ailment"
        message="This will permanently remove the ailment from the platform. Are you sure you want to delete this ailment?"
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />
    </DashboardLayout>
  );
};

export default AlimentManagementPage;
