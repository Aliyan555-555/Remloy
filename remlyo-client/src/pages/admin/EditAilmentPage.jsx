import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  AilmentCategories,
  AilmentInitialState,
  AilmentSeverityOptions,
} from "../../constants";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getAilmentById, updateAilment } from "../../api/ailmentsApi";

const EditAilmentPage = () => {
  const { user, authToken } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const { ailmentId } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState(AilmentInitialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [currentCause, setCurrentCause] = useState("");
  const [currentPrevention, setCurrentPrevention] = useState("");

  const fetchAilments = async () => {

    const res = await getAilmentById(authToken,ailmentId);
    if (res.success) {
      setFormData(res.ailment);
      setInitialLoading(false);
    }
  };

  const handleBack = () => navigate("/admin/ailments");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Tag-style add/remove for arrays
  const handleAddArrayItem = (key, value, setValue) => {
    const trimmed = value.trim();
    if (trimmed && !formData[key].includes(trimmed)) {
      setFormData((prev) => ({ ...prev, [key]: [...prev[key], trimmed] }));
    }
    setValue("");
  };
  const handleRemoveArrayItem = (key, item) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((i) => i !== item),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.symptoms.length)
      newErrors.symptoms = "At least one symptom is required";
    if (!formData.severity) newErrors.severity = "Severity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await updateAilment(authToken, formData._id, formData);
      if (res.success) {
        setSubmitSuccess("Ailment update successfully!");
        setFormData(AilmentInitialState);
        navigate("/admin/ailments");
      } else {
        setSubmitError(res.message || "Failed to create ailment");
      }
    } catch (error) {
      setSubmitError(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAilments();
  }, []);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout user={user} pageTitle="Edit Ailment">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Edit Ailemnt</h1>
          <Button
            variant="outlined"
            color="default"
            onClick={handleBack}
            className="flnot sure ex items-center"
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
        <p className="text-gray-600">Edit a ailment to the platform</p>
      </div>

      <form
        className="bg-white p-6 rounded-lg border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ailment name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            >
              <option value="">Select Category</option>
              {AilmentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the ailment..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleAddArrayItem(
                  "symptoms",
                  currentSymptom,
                  setCurrentSymptom
                ))
              }
              placeholder="Type symptom and press Enter"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <Button
              type="button"
              onClick={() =>
                handleAddArrayItem(
                  "symptoms",
                  currentSymptom,
                  setCurrentSymptom
                )
              }
              disabled={!currentSymptom.trim()}
            >
              Add
            </Button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {formData.symptoms.map((symptom) => (
              <div
                key={symptom}
                className="rounded-[30px] bg-gray-100 px-4 py-1 flex items-center gap-2"
              >
                {symptom}
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("symptoms", symptom)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
              </div>
            ))}
          </div>
          {errors.symptoms && (
            <p className="text-red-500 text-xs mt-1">{errors.symptoms}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Causes & Risks
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentCause}
              onChange={(e) => setCurrentCause(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleAddArrayItem(
                  "causesAndRisks",
                  currentCause,
                  setCurrentCause
                ))
              }
              placeholder="Type cause/risk and press Enter"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <Button
              type="button"
              onClick={() =>
                handleAddArrayItem(
                  "causesAndRisks",
                  currentCause,
                  setCurrentCause
                )
              }
              disabled={!currentCause.trim()}
            >
              Add
            </Button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {formData.causesAndRisks.map((cause) => (
              <div
                key={cause}
                className="rounded-[30px] bg-gray-100 px-4 py-1 flex items-center gap-2"
              >
                {cause}
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("causesAndRisks", cause)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prevention Tips
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentPrevention}
              onChange={(e) => setCurrentPrevention(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleAddArrayItem(
                  "preventionTips",
                  currentPrevention,
                  setCurrentPrevention
                ))
              }
              placeholder="Type tip and press Enter"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <Button
              type="button"
              onClick={() =>
                handleAddArrayItem(
                  "preventionTips",
                  currentPrevention,
                  setCurrentPrevention
                )
              }
              disabled={!currentPrevention.trim()}
            >
              Add
            </Button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {formData.preventionTips.map((tip) => (
              <div
                key={tip}
                className="rounded-[30px] bg-gray-100 px-4 py-1 flex items-center gap-2"
              >
                {tip}
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("preventionTips", tip)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity <span className="text-red-500">*</span>
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <option value="">Select Severity</option>
            {AilmentSeverityOptions.map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>
          {errors.severity && (
            <p className="text-red-500 text-xs mt-1">{errors.severity}</p>
          )}
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isCommon"
              checked={formData.isCommon}
              onChange={handleChange}
            />
            Common Ailment
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isContagious"
              checked={formData.isContagious}
              onChange={handleChange}
            />
            Contagious
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="requiresMedicalAttention"
              checked={formData.requiresMedicalAttention}
              onChange={handleChange}
            />
            Requires Medical Attention
          </label>
        </div>
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">{submitSuccess}</p>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button
            color="brand"
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default EditAilmentPage;
