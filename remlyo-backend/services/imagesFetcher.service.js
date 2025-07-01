// services/imagesFetcher.service.js

import { MIME_TYPE_MAP, PIXABAY_CONFIG } from "../constants/index.js";

/**
 * Fetches a remedy image from Pixabay, Unsplash, or fallback in order
 * @param {string} query - The search query for the image
 * @returns {Promise<{type: string, source: string}>} - Image data object (never null)
 */
export const fetchRemedyImageWithType = async (query) => {
  // Input validation
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    throw new Error(
      "Query parameter is required and must be a non-empty string"
    );
  }
  const trimmedQuery = query.trim();

  // 1. Try Pixabay
  try {
    const pixabayResult = await fetchFromPixabay(trimmedQuery);
    if (pixabayResult) return pixabayResult;
  } catch (e) {
    // Continue to next source
  }

  // 2. Try Unsplash
  try {
    const unsplashResult = await fetchFromUnsplash(trimmedQuery);
    if (unsplashResult) return unsplashResult;
  } catch (e) {
    // Continue to next source
  }

  // 3. Fallback image (local or static)
  return getFallbackImage();
};

/**
 * Fetches an image from Pixabay API
 * @param {string} query
 * @returns {Promise<{type: string, source: string} | null>}
 */
const fetchFromPixabay = async (query) => {
  if (!process.env.PIXABAY_API_KEY) {
    throw new Error("PIXABAY_API_KEY environment variable is required");
  }
  const params = new URLSearchParams({
    key: process.env.PIXABAY_API_KEY,
    q: query,
    image_type: PIXABAY_CONFIG.IMAGE_TYPE,
    safesearch: PIXABAY_CONFIG.SAFE_SEARCH,
  });
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
  const image = data?.hits?.[0];
  if (!image || !image.webformatURL) {
    return null;
  }
  const url = image.webformatURL;
  const extension = extractImageExtension(url);
  const mimeType = getMimeType(extension);
  return {
    type: mimeType,
    source: url,
  };
};

/**
 * Fetches an image from Unsplash API
 * @param {string} query
 * @returns {Promise<{type: string, source: string} | null>}
 */
const fetchFromUnsplash = async (query) => {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    throw new Error("UNSPLASH_ACCESS_KEY environment variable is required");
  }
  const params = new URLSearchParams({
    query,
    client_id: process.env.UNSPLASH_ACCESS_KEY,
    per_page: 1,
    orientation: "squarish",
  });
  const response = await fetch(`https://api.unsplash.com/search/photos?${params}`);
  if (!response.ok) {
    throw new Error(
      `Unsplash API error: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  const image = data?.results?.[0];
  if (!image || !image.urls?.regular) {
    return null;
  }
  const url = image.urls.regular;
  const extension = extractImageExtension(url);
  const mimeType = getMimeType(extension);
  return {
    type: mimeType,
    source: url,
  };
};

/**
 * Returns a fallback image object (local or static URL)
 * @returns {{type: string, source: string}}
 */
const getFallbackImage = () => {
  // You can use a local image or a static hosted image URL
  const fallbackUrl =
    "https://placehold.co/600x400?text=Remlyo";
  return {
    type: "image/png",
    source: fallbackUrl,
  };
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
