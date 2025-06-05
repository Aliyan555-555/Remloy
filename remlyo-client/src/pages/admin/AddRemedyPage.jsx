import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import FileUpload from "../../components/common/FileUpload";
import { useAuth } from "../../contexts/AuthContext";
import { createRemedy } from "../../api/adminApi";

// Constants
const REMEDY_TYPES = {
  PHARMACEUTICAL: "pharmaceutical",
  ALTERNATIVE: "alternative",
  COMMUNITY: "community",
};

const CATEGORIES = [
  "Pain Relief",
  "Respiratory",
  "Digestive",
  "Immune Support",
  "Sleep Aid",
  "Skin Care",
];

const TABS = {
  BATCH: "batch",
  GENERAL: "general",
  INGREDIENTS: "ingredients",
};

const MAX_FILE_SIZE = {
  EXCEL: 5 * 1024 * 1024, // 5MB
  IMAGE: 2 * 1024 * 1024, // 2MB
};

const AddRemedyPage = () => {
  const { user, authToken } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [activeTab, setActiveTab] = useState(TABS.BATCH);
  const [remedyType, setRemedyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    ingredients: [],
    instructions: "",
    sideEffects: "",
    references: "",
    practitionerName: "",
    mediaFile: null,
  });

  const [errors, setErrors] = useState({});

  // Handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when field is modified
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  const handleIngredientsChange = useCallback(
    (e) => {
      const input = e.target.value;
      const values = input
        .split("\n") // Split by new line instead of comma
        .map((item) => item.trim());

      setFormData((prev) => ({
        ...prev,
        ingredients: values,
      }));
      if (errors.ingredients) {
        setErrors((prev) => ({
          ...prev,
          ingredients: null,
        }));
      }
    },
    [errors]
  );

  const handleFileUpload = useCallback((file) => {
    setFormData((prev) => ({
      ...prev,
      mediaFile: file,
    }));
  }, []);

  const handleSelectRemedyType = useCallback((type) => {
    setRemedyType(type);
    setActiveTab(TABS.GENERAL);
  }, []);

  const handleBack = useCallback(() => {
    if (remedyType && activeTab !== TABS.BATCH) {
      setActiveTab(TABS.BATCH);
      setRemedyType("");
    } else {
      navigate("/admin/remedies");
    }
  }, [remedyType, activeTab, navigate]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Remedy title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.ingredients.length) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }

    if (remedyType === REMEDY_TYPES.PHARMACEUTICAL) {
      if (formData.sideEffects.trim() && !formData.references.trim()) {
        newErrors.references =
          "References are required when side effects are provided";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, remedyType]);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (validateForm()) {
        const processedData = {
          ...formData,
          type: remedyType,
          sideEffects: formData.sideEffects
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item),
          references: formData.references
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item),
        };

        const res = await createRemedy(authToken, processedData);

        if (res.success) {
          navigate("/admin/remedies");
        } else {
          setError(res.message || "Failed to create remedy");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the remedy");
      console.error("Error creating remedy:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render Functions
  const renderRemedyTypeSelection = () => (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-6">Select Remedy Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(REMEDY_TYPES).map(([key, type]) => (
          <button
            key={type}
            onClick={() => handleSelectRemedyType(type)}
            className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-center transition-colors flex flex-col items-center"
          >
            <div
              className={`bg-${
                key === "PHARMACEUTICAL"
                  ? "green"
                  : key === "ALTERNATIVE"
                  ? "purple"
                  : "blue"
              }-100 p-3 rounded-full mb-3`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-10 w-10 text-${
                  key === "PHARMACEUTICAL"
                    ? "green"
                    : key === "ALTERNATIVE"
                    ? "purple"
                    : "blue"
                }-600`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    key === "PHARMACEUTICAL"
                      ? "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      : key === "ALTERNATIVE"
                      ? "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      : "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  }
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {key.charAt(0) + key.slice(1).toLowerCase()} Remedy
            </h3>
            <p className="text-gray-600 text-sm">
              {key === "PHARMACEUTICAL"
                ? "Add medicine and prescription remedies"
                : key === "ALTERNATIVE"
                ? "Add natural and holistic treatments"
                : "Add user-submitted home remedies"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {Object.entries(TABS).map(([key, value]) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            disabled={!remedyType && value !== TABS.BATCH}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === value
                ? "border-brand-green text-brand-green"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } ${
              !remedyType && value !== TABS.BATCH
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderBatchUploadTab = () => (
    <div>
      {remedyType ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Excel</h3>
          <p className="text-gray-600 mb-4">
            Upload multiple {remedyType} remedies at once using our template.
          </p>

          <div className="flex justify-end mb-4">
            <Button
              variant="outlined"
              color="brand"
              className="flex items-center"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Excel Template
            </Button>
          </div>

          <FileUpload
            onFileSelect={handleFileUpload}
            acceptedFileTypes={[
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ]}
            maxFileSize={MAX_FILE_SIZE.EXCEL}
            dropzoneText="Drag & Drop Excel File or Click to Browse"
            helperText="Supported file types: XLS, XLSX. Maximum file size: 5MB"
          />

          <div className="flex justify-end mt-6">
            <Button variant="contained" color="brand" disabled={loading}>
              {loading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        renderRemedyTypeSelection()
      )}
    </div>
  );

  const renderGeneralTab = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">General Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remedy Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remedy Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter remedy title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description here..."
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image
        </label>
        <FileUpload
          onFileSelect={handleFileUpload}
          acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
          maxFileSize={MAX_FILE_SIZE.IMAGE}
          dropzoneText="Drag & Drop image or Click to Browse"
          helperText="Supported file types: JPG, PNG, GIF. Maximum file size: 2MB"
        />
      </div>
    </div>
  );

  const renderIngredientsTab = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Ingredients & Instructions</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingredients <span className="text-red-500">*</span>
        </label>
        <textarea
          name="ingredients"
          value={formData.ingredients.join("\n")}
          onChange={handleIngredientsChange}
          placeholder="Enter ingredients (comma-separated)..."
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        {errors.ingredients && (
          <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions <span className="text-red-500">*</span>
        </label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="Enter instructions here..."
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        {errors.instructions && (
          <p className="text-red-500 text-xs mt-1">{errors.instructions}</p>
        )}
      </div>

      {remedyType === REMEDY_TYPES.PHARMACEUTICAL && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Side Effects
            </label>
            <textarea
              name="sideEffects"
              value={formData.sideEffects}
              onChange={handleChange}
              placeholder="Enter side effects (one per line)..."
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical References
            </label>
            <textarea
              name="references"
              value={formData.references}
              onChange={handleChange}
              placeholder="Enter medical references (one per line)..."
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            {errors.references && (
              <p className="text-red-500 text-xs mt-1">{errors.references}</p>
            )}
          </div>
        </>
      )}

      {remedyType === REMEDY_TYPES.ALTERNATIVE && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Practitioner Name
          </label>
          <input
            type="text"
            name="practitionerName"
            value={formData.practitionerName}
            onChange={handleChange}
            placeholder="Enter practitioner name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout pageTitle="Add Remedy" user={user}>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Add Remedy</h1>
          <Button
            variant="outlined"
            color="default"
            onClick={handleBack}
            className="flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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
            Back
          </Button>
        </div>
        <p className="text-gray-600">Add a new remedy to the platform</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {renderTabs()}

        {activeTab === TABS.BATCH && renderBatchUploadTab()}
        {activeTab === TABS.GENERAL && renderGeneralTab()}
        {activeTab === TABS.INGREDIENTS && renderIngredientsTab()}

        {activeTab !== TABS.BATCH && (
          <div className="flex justify-end mt-6 space-x-4">
            <Button
              variant="outlined"
              color="default"
              type="button"
              onClick={() =>
                setActiveTab(
                  activeTab === TABS.INGREDIENTS ? TABS.GENERAL : TABS.BATCH
                )
              }
            >
              {activeTab === TABS.INGREDIENTS ? "Previous" : "Cancel"}
            </Button>

            {activeTab === TABS.GENERAL ? (
              <Button
                variant="contained"
                color="brand"
                type="button"
                onClick={() => setActiveTab(TABS.INGREDIENTS)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="brand"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        )}
      </form>
    </DashboardLayout>
  );
};

export default AddRemedyPage;
