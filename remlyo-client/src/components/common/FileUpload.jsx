// src/components/common/FileUpload.jsx
import React, { useState, useRef } from 'react';
import Button from './Button';

/**
 * FileUpload component for handling file uploads
 * @param {Object} props
 * @param {function} props.onFileSelect - Function called when file is selected
 * @param {Array} props.acceptedFileTypes - Array of accepted file types (e.g., ['image/jpeg', 'image/png'])
 * @param {number} props.maxFileSize - Maximum file size in bytes
 * @param {boolean} props.multiple - Whether multiple files can be selected
 * @param {string} props.label - Upload area label
 * @param {string} props.dropzoneText - Text displayed in the dropzone
 * @param {string} props.browseText - Text for the browse button
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Variant of upload area ('default', 'compact', 'bordered')
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.helperText - Helper text
 */
const FileUpload = ({
  onFileSelect,
  acceptedFileTypes = [],
  maxFileSize,
  multiple = false,
  label,
  dropzoneText = "Drag & Drop files or Click to Browse",
  browseText = "Browse",
  className = "",
  variant = "default",
  errorMessage,
  helperText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(errorMessage);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Format file size for display
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    else return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Validate file type and size
  const validateFile = (file) => {
    // Check file type if acceptedFileTypes is provided
    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
      setError(`File type not accepted. Accepted types: ${acceptedFileTypes.join(', ')}`);
      return false;
    }

    // Check file size if maxFileSize is provided
    if (maxFileSize && file.size > maxFileSize) {
      setError(`File size exceeds the maximum allowed (${formatFileSize(maxFileSize)})`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    setError(null);
    
    const validFiles = Array.from(selectedFiles).filter(validateFile);
    
    if (validFiles.length === 0) return;
    
    // If multiple is false, only keep the first valid file
    const newFiles = multiple ? [...files, ...validFiles] : [validFiles[0]];
    setFiles(newFiles);
    
    // Call the onFileSelect callback with the new files
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : newFiles[0]);
    }
  };

  // Handle click on the dropzone
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  // Remove a file
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Call the onFileSelect callback with the new files
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : newFiles[0] || null);
    }
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
    if (onFileSelect) {
      onFileSelect(multiple ? [] : null);
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-2 border border-gray-300 bg-white';
      case 'bordered':
        return 'p-6 border-2 border-dashed border-gray-300 bg-gray-50';
      default:
        return 'p-6 border border-gray-300 bg-white';
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
      )}

      {/* Dropzone */}
      <div
        className={`rounded-lg ${getVariantClasses()} ${
          isDragging ? 'border-brand-green bg-green-50' : ''
        } ${error ? 'border-red-300' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-center">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept={acceptedFileTypes.join(',')}
            multiple={multiple}
            className="hidden"
          />

          {/* Icon */}
          <div className="flex justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Dropzone text */}
          <p className="text-gray-600 mb-2">{dropzoneText}</p>

          {/* Browse button */}
          <Button variant="outlined" size="small" type="button">
            {browseText}
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
            {files.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFiles();
                }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center">
                  {/* File type icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate" style={{ maxWidth: '200px' }}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;