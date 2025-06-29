// services/imagesFetcher.service.js

import { MIME_TYPE_MAP, PIXABAY_CONFIG } from "../constants/index.js";

/**
 * Fetches a remedy image from Pixabay API based on the provided query
 * @param {string} query - The search query for the image
 * @returns {Promise<{type: string, source: string} | null>} - Image data object or null if not found
 * @throws {Error} - When API key is missing, query is invalid, or network error occurs
 */
export const fetchRemedyImageWithType = async (query) => {
  // Input validation
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    throw new Error(
      "Query parameter is required and must be a non-empty string"
    );
  }

  if (!process.env.PIXABAY_API_KEY) {
    throw new Error("PIXABAY_API_KEY environment variable is required");
  }

  const trimmedQuery = query.trim();

  try {
    // Prepare API parameters
    const params = new URLSearchParams({
      key: process.env.PIXABAY_API_KEY,
      q: trimmedQuery,
      image_type: PIXABAY_CONFIG.IMAGE_TYPE,
      safesearch: PIXABAY_CONFIG.SAFE_SEARCH,
    });

    // Create fetch request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      PIXABAY_CONFIG.TIMEOUT_MS
    );

    const response = await fetch(`${PIXABAY_CONFIG.BASE_URL}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Pixabay API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate API response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from Pixabay API");
    }

    const image = data?.hits?.[0];
    if (!image || !image.webformatURL) {
      return null; // No images found for the query
    }

    const url = image.webformatURL;
    const extension = extractImageExtension(url);
    const mimeType = getMimeType(extension);

    return {
      type: mimeType,
      source: url,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${PIXABAY_CONFIG.TIMEOUT_MS}ms`);
    }

    // Re-throw validation and API errors
    if (
      error.message.includes("Query parameter") ||
      error.message.includes("PIXABAY_API_KEY") ||
      error.message.includes("Pixabay API error") ||
      error.message.includes("Invalid response format") ||
      error.message.includes("Request timeout")
    ) {
      throw error;
    }

    // Log and throw generic error for unexpected issues
    console.error(
      "Unexpected error in fetchRemedyImageWithType:",
      error.message
    );
    throw new Error("Failed to fetch image from external service");
  }
};

/**
 * Extracts the file extension from a URL
 * @param {string} url - The image URL
 * @returns {string} - The file extension (lowercase)
 */
const extractImageExtension = (url) => {
  try {
    const urlParts = url.split("?")[0]; // Remove query parameters
    const extension = urlParts.split(".").pop().toLowerCase();
    return extension || "jpg"; // Default to jpg if no extension found
  } catch (error) {
    console.warn("Failed to extract extension from URL:", url);
    return "jpg"; // Default fallback
  }
};

/**
 * Maps file extension to MIME type
 * @param {string} extension - The file extension
 * @returns {string} - The corresponding MIME type
 */
const getMimeType = (extension) => {
  return MIME_TYPE_MAP[extension] || "image/jpeg"; // Default to JPEG
};
