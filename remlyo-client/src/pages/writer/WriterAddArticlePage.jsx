import React, { useState, useEffect } from "react";
import DashboardLayout from "./../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, MAX_FILE_SIZE } from "../../constants";
import TextEditor from "../../components/common/TextEditor";
import FileUpload from "../../components/common/FileUpload";
import { checkSlug, createArticle, generateSlug } from "../../api/articleApi";

const WriterAddArticlePage = () => {
  const { user, authToken } = useAuth();
  const [errors, setErrors] = useState({});
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const navigate = useNavigate();
  const [slugLoading, setSlugLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [currentTag, setCurrentTag] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    tags: [],
    category: "",
    slug: "",
    author: user._id,
    media: {
      type: "",
      source: "",
    },
    seo: {
      metaTitle: "", //max length 60
      metaDescription: "", // max length 160
      keywords: [], // string keywords
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Debounce slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.slug) {
        checkSlugUniqueness(formData.slug);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleBack = () => navigate("/writer/articles");

  const validateSlug = (slug) => {
    if (!slug) return "Slug is required";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    if (slug.length < 3) return "Slug must be at least 3 characters long";
    // if (slug.length > 60) return "Slug must be less than 60 characters";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleGenerateSlug = async () => {
    if (!formData.title) {
      setErrors((prev) => ({
        ...prev,
        title: "Please enter a title first",
      }));
      return;
    }

    try {
      if (slugLoading) return;
      setSlugLoading(true);
      setErrors((prev) => ({ ...prev, slug: null }));

      const slug = await generateSlug(authToken, formData.title);
      if (!slug) {
        throw new Error("Failed to generate slug");
      }

      setFormData((prev) => ({
        ...prev,
        slug,
      }));

      // Validate the generated slug
      const slugError = validateSlug(slug);
      if (slugError) {
        setErrors((prev) => ({ ...prev, slug: slugError }));
      } else {
        await checkSlugUniqueness(slug);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        slug: error.message || "Failed to generate slug. Please try again.",
      }));
    } finally {
      setSlugLoading(false);
    }
  };

  const checkSlugUniqueness = async (slug) => {
    if (!slug) return;

    const slugError = validateSlug(slug);
    if (slugError) {
      setErrors((prev) => ({ ...prev, slug: slugError }));
      return;
    }

    setIsCheckingSlug(true);
    try {
      const res = await checkSlug(authToken, slug);
      if (res.success && !res.isUnique) {
        setErrors((prev) => ({
          ...prev,
          slug: "This slug is already taken. Please try another one.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          slug: null,
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        slug: "Failed to check slug availability. Please try again.",
      }));
      console.error("Error checking slug:", error);
    } finally {
      setIsCheckingSlug(false);
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

  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedTag = currentTag.trim();

      if (
        trimmedTag &&
        !formData.tags.includes(trimmedTag) &&
        formData.tags.length < 5
      ) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, trimmedTag],
        }));
      }

      setCurrentTag("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleAddKeyword = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedKeyword = currentKeyword.trim();

      if (
        trimmedKeyword &&
        !formData.seo.keywords.includes(trimmedKeyword) &&
        formData.seo.keywords.length < 10
      ) {
        setFormData((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            keywords: [...prev.seo.keywords, trimmedKeyword],
          },
        }));
      }

      setCurrentKeyword("");
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((keyword) => keyword !== keywordToDelete),
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    } else {
      const slugError = validateSlug(formData.slug);
      if (slugError) newErrors.slug = slugError;
    }
    
    if (!formData.shortDescription?.trim()) {
      newErrors.shortDescription = "Description is required";
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    // SEO validation
    if (formData.seo.metaTitle && formData.seo.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title must be less than 60 characters";
    }

    if (formData.seo.metaDescription && formData.seo.metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description must be less than 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortDescription: "",
      content: "",
      tags: [],
      category: "",
      slug: "",
      author: user._id,
      media: {
        type: "",
        source: "",
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    });
    setErrors({});
    setCurrentTag("");
    setCurrentKeyword("");
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate form before submission
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      const res = await createArticle(authToken, formData);

      if (res.success) {
        // Show success message or notification here if you have a notification system
        resetForm();
        navigate("/writer/articles");
      } else {
        setSubmitError(res.message || "Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      setSubmitError(
        error.message || "An error occurred while creating the article"
      );
    } finally {
      setIsSubmitting(false);
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
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
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
                className="whitespace-nowrap rounded-l-0"
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
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <div className="flex gap-1 pt-3 flex-wrap">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="rounded-[30px] text-lg bg-gray-100 px-4 py-1 flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
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
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Enter description here..."
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-xs mt-1">
              {errors.shortDescription}
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
                <span className="text-gray-500 text-xs ml-1">
                  (max 60 characters)
                </span>
              </label>
              <input
                type="text"
                value={formData.seo.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: e.target.value },
                  }))
                }
                placeholder="Enter meta title"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              {errors.metaTitle && (
                <p className="text-red-500 text-xs mt-1">{errors.metaTitle}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.seo.metaTitle.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
                <span className="text-gray-500 text-xs ml-1">
                  (max 160 characters)
                </span>
              </label>
              <textarea
                value={formData.seo.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: e.target.value },
                  }))
                }
                placeholder="Enter meta description"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              {errors.metaDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.metaDescription}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.seo.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords (max 10)
              </label>
              <input
                type="text"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="Type keyword and press Enter"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <div className="flex gap-1 pt-3 flex-wrap">
                {formData.seo.keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="rounded-[30px] text-lg bg-gray-100 px-4 py-1 flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      onClick={() => handleDeleteKeyword(keyword)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
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
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            color="brand"
            onClick={handleSubmit}
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
      </div>
    </DashboardLayout>
  );
};

export default WriterAddArticlePage;
