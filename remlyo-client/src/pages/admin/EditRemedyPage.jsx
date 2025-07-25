import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import FileUpload from "../../components/common/FileUpload";
import { useAuth } from "../../contexts/AuthContext";
import TextEditor from "../../components/common/TextEditor";
import { updateRemedy } from "../../api/remediesApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { CATEGORIES, MAX_FILE_SIZE, REMEDY_TYPES, TABS } from "../../constants";
import { fetchAilments } from "../../api/ailmentsApi";
import Select from "react-select";
import { getRemedyById } from "../../api/adminApi";
const EditRemedy = () => {
  const { user, authToken } = useAuth();
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const { remedyId } = useParams();
  const [activeTab, setActiveTab] = useState(TABS.GENERAL);
  const [remedyType, setRemedyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [ailmentOptions, setAilmentOptions] = useState([]);
  const [ailmentsLoading, setAilmentsLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  const handleFileUpload = async (files) => {
    try {
      setFormData((prev) => ({
        ...prev,
        media: {
          type: files[0].mimetype,
          source: files[0].secure_url,
        },
      }));
    } catch (error) {
      setUploadError(error.message || "Failed to upload image");
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setAilmentsLoading(true);
    fetchAilments(authToken)
      .then((res) => {
        if (res.success) {
          setAilmentOptions(
            res.ailments.map((a) => ({
              value: a._id,
              label: a.name,
            }))
          );
        }
      })
      .finally(() => setAilmentsLoading(false));
  }, [authToken]);

  const handleSelectRemedyType = (type) => {
    setRemedyType(type);
  };

  const fetchRemedy = async () => {
    const res = await getRemedyById(authToken, remedyId);
    if (res.success) {
      setFormData(res.remedy);
      setInitialLoading(false);
      setRemedyType(res.remedy.type);
    }
  };

  const handleBack = () => {
    if (remedyType && activeTab !== TABS.BATCH) {
      setActiveTab(TABS.GENERAL);
    } else {
      navigate("/admin/remedies");
    }
  };

  // New handler for ailments select
  const handleAilmentsChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      ailments: selected ? selected.map((s) => s.value) : [],
    }));
    if (errors.ailments) {
      setErrors((prev) => ({
        ...prev,
        ailments: null,
      }));
    }
  };
  // Validation
  const validateForm = () => {
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

    if (remedyType !== REMEDY_TYPES.PHARMACEUTICAL) {
      if (!formData.ingredients.trim()) {
        newErrors.ingredients = "At least one ingredient is required";
      }

      if (!formData.instructions.trim()) {
        newErrors.instructions = "Instructions are required";
      }
    }

    if (remedyType === REMEDY_TYPES.PHARMACEUTICAL) {
      if (!formData.brandName.trim()) {
        newErrors.brandName = "brand name is required";
      }
      if (!formData.dosageAndUsage.trim()) {
        newErrors.dosageAndUsage = "dosage and usage is required";
      }
      if (!formData.howToTakeIt.trim()) {
        newErrors.howToTakeIt = "how to take it info is required";
      }
      if (!formData.storageInstructions.trim()) {
        newErrors.storageInstructions = "storage instructions is required";
      }
      if (!formData.equipments.trim()) {
        newErrors.equipments = "equipments is required";
      }
      if (formData.sideEffects && !formData.references) {
        newErrors.references =
          "References are required when side effects are provided";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        };

        const res = await updateRemedy(authToken, remedyId, processedData);

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
            type="button"
            onClick={() => handleSelectRemedyType(type)}
            className={
              "bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-center transition-colors flex flex-col items-center" +
              (remedyType === type ? " !border-2 !border-brand-green" : "")
            }
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

  const renderGeneralTab = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">General Information</h3>
      <div className="w-full mb-10">{renderRemedyTypeSelection()}</div>
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
          maxFileSize={MAX_FILE_SIZE}
          dropzoneText="Drag & Drop image or Click to Browse"
          helperText="Supported file types: JPG, PNG, GIF. Maximum file size: 2MB"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <TextEditor
          value={formData.content}
          maxLength={1000}
          className=""
          placeholder="Enter content"
          error={null}
          onChange={handleChange}
          minHeight="100px"
          name="content"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Related Ailments <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          isLoading={ailmentsLoading}
          options={ailmentOptions}
          value={ailmentOptions.filter((opt) =>
            formData.ailments.includes(opt.value)
          )}
          onChange={handleAilmentsChange}
          placeholder="Select related ailments..."
        />
        {errors.ailments && (
          <p className="text-red-500 text-xs mt-1">{errors.ailments}</p>
        )}
      </div>
    </div>
  );

  const renderIngredientsTab = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Ingredients & Instructions</h3>

      {remedyType !== REMEDY_TYPES.PHARMACEUTICAL && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients <span className="text-red-500">*</span>
          </label>

          <TextEditor
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Enter ingredients"
            minHeight="100px"
            isHeadings={false}
            isLinks={false}
            isFormatting={false}
            isAlignment={false}
            isHighlight={false}
          />
          {errors.ingredients && (
            <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>
          )}
        </div>
      )}

      {remedyType !== REMEDY_TYPES.PHARMACEUTICAL && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions <span className="text-red-500">*</span>
          </label>

          <TextEditor
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Enter instructions"
            isAlignment={false}
            minHeight="100px"
            isHeadings={false}
          />
          {errors.instructions && (
            <p className="text-red-500 text-xs mt-1">{errors.instructions}</p>
          )}
        </div>
      )}

      {remedyType === REMEDY_TYPES.PHARMACEUTICAL && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name
          </label>
          <TextEditor
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            isHeadings={false}
            placeholder="Enter Brand Name"
            minHeight="100px"
            isAlignment={false}
          />
          {errors.brandName && (
            <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>
          )}
        </div>
      )}

      {remedyType === REMEDY_TYPES.PHARMACEUTICAL && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dosage & Usage
          </label>
          <TextEditor
            name="dosageAndUsage"
            value={formData.dosageAndUsage}
            onChange={handleChange}
            isHeadings={false}
            placeholder="Enter how To Take It instructions"
            minHeight="100px"
            isAlignment={false}
          />
          {errors.dosageAndUsage && (
            <p className="text-red-500 text-xs mt-1">{errors.dosageAndUsage}</p>
          )}
        </div>
      )}

      {remedyType === REMEDY_TYPES.PHARMACEUTICAL && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How to Take It
          </label>
          <TextEditor
            name="howToTakeIt"
            value={formData.howToTakeIt}
            onChange={handleChange}
            isHeadings={false}
            placeholder="Enter how To Take It instructions"
            minHeight="100px"
            isAlignment={false}
          />
        </div>
      )}

      {remedyType === REMEDY_TYPES.PHARMACEUTICAL && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Side Effects
            </label>
            <TextEditor
              name="sideEffects"
              value={formData.sideEffects}
              onChange={handleChange}
              isHeadings={false}
              placeholder="Enter side effects"
              minHeight="100px"
              isAlignment={false}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical References
            </label>

            <TextEditor
              name="references"
              value={formData.references}
              onChange={handleChange}
              placeholder="Enter medical references"
              isAlignment={false}
              isHeadings={false}
              minHeight="100px"
            />
            {errors.references && (
              <p className="text-red-500 text-xs mt-1">{errors.references}</p>
            )}
          </div>
        </>
      )}

      {remedyType === REMEDY_TYPES.PHARMACEUTICAL && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Storage Instructions
          </label>
          <TextEditor
            name="storageInstructions"
            value={formData.storageInstructions}
            onChange={handleChange}
            isHeadings={false}
            placeholder="Enter side effects"
            minHeight="100px"
            isAlignment={false}
          />
          {errors.storageInstructions && (
            <p className="text-red-500 text-xs mt-1">
              {errors.storageInstructions}
            </p>
          )}
        </div>
      )}

      {remedyType === REMEDY_TYPES.ALTERNATIVE && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Practitioner Name
          </label>
          <TextEditor
            name="practitionerName"
            value={formData.practitionerName}
            onChange={handleChange}
            placeholder="Enter practitioner name"
            isHeadings={false}
            isAlignment={false}
            isLinks={false}
            isHighlight={false}
            minHeight="50px"
          />
        </div>
      )}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Equipment
        </label>
        <TextEditor
          value={formData.equipments}
          onChange={handleChange}
          name="equipments"
          placeholder="Enter Equipments"
          isHeadings={false}
          minHeight="50px"
          isAlignment={false}
          isLinks={false}
          isHighlight={false}
        />
        {errors.equipments && (
          <p className="text-red-500 text-xs mt-1">{errors.equipments}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Preparation Time
        </label>
        <select
          onChange={handleChange}
          name={"preparationTime"}
          value={formData.preparationTime}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
        >
          <option value="">Select time</option>
          <option value="5–10 minutes to prepare">
            5–10 minutes to prepare
          </option>
          <option value="10–15 minutes to prepare">
            10–15 minutes to prepare
          </option>
          <option value="15–30 minutes to prepare">
            15–30 minutes to prepare
          </option>
          <option value="30–45 minutes to prepare">
            30–45 minutes to prepare
          </option>
          <option value="45–60 minutes to prepare">
            45–60 minutes to prepare
          </option>
          <option value="More than 1 hour to prepare">
            More than 1 hour to prepare
          </option>
        </select>
      </div>
    </div>
  );

  useEffect(() => {
    fetchRemedy();
  }, []);

  if (initialLoading) {
    return <LoadingSpinner />;
  }
  return (
    <DashboardLayout pageTitle="Edit Remedy" user={user}>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Edit Remedy</h1>
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
        <p className="text-gray-600">Edit a remedy to the platform</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div>
        {renderTabs()}

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
                type="button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditRemedy;
