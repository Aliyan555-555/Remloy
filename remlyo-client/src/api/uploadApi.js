import API from "../services/api";
import { getAuthHeaders } from "../utils";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
};

const uploadImage = async (authToken, file) => {
  try {
    validateFile(file);

    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post("/api/v1/upload/image", formData, {
      headers: {
        ...getAuthHeaders(authToken),
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res.data.success) {
      throw new Error(res.data.message || 'Upload failed');
    }

    // Map the response to match our frontend structure
    return {
      success: true,
      data: {
        publicId: res.data.public_id,
        secureUrl: res.data.secure_url,
        originalName: res.data.originalname,
        mimeType: res.data.mimetype,
        size: res.data.size
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with an error
      return {
        success: false,
        error: error.response.data?.message || 'Server error occurred'
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'No response from server. Please check your internet connection.'
      };
    } else {
      // Other errors (like validation errors)
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  }
};

export { uploadImage };
