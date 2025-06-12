import React, { useState } from "react";
import DashboardLayout from "./../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, MAX_FILE_SIZE } from "../../constants";
import TextEditor from "../../components/common/TextEditor";
import FileUpload from "../../components/common/FileUpload";

const WriterAddArticlePage = () => {
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    shotDescription: "",
    content: "",
    tags: [],
    category: "",
    slug: "",
    media: {
      type: "",
      source: "",
    },
  });

  const handleBack = () => navigate("/writer/articles");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleGenerateSlug = () => {
    const slug = generateSlug(formData.title);
    setFormData(prev => ({
      ...prev,
      slug
    }));
    checkSlugUniqueness(slug);
  };

  const checkSlugUniqueness = async (slug) => {
    if (!slug) return;
    setIsCheckingSlug(true);
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/articles/check-slug/${slug}`);
      const data = await response.json();
      if (!data.isUnique) {
        setErrors(prev => ({
          ...prev,
          slug: "This slug is already taken. Please try another one."
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          slug: null
        }));
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (tags.length <= 5) {
      setFormData(prev => ({
        ...prev,
        tags
      }));
    }
  };

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

  return (
    <DashboardLayout user={user} pageTitle="Add Article">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Add Article</h1>
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
        <p className="text-gray-600">Add a new article to the platform</p>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article Category <span className="text-red-500">*</span>
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
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="article-slug"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <Button
                variant="outlined"
                color="default"
                onClick={handleGenerateSlug}
                disabled={!formData.title || isCheckingSlug}
                className="whitespace-nowrap"
              >
                {isCheckingSlug ? "Checking..." : "Generate Slug"}
              </Button>
            </div>
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (max 5) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="Enter tags separated by commas"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.tags.length}/5 tags
            </p>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.shotDescription}
            onChange={handleChange}
            placeholder="Enter description here..."
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.shotDescription}
            </p>
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
      </div>
    </DashboardLayout>
  );
};

export default WriterAddArticlePage;
