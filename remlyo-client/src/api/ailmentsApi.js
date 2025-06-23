import API from "../services/api";
import { getAuthHeaders, handleApiError } from "../utils";

/**
 * Get all ailments with pagination and filters
 * @param {string} token - Authentication token
 * @param {Object} options - Query options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string} [options.search]
 * @returns {Promise<Object>}
 */
const getAllAilments = async (
  token,
  { page = 1, limit = 10, search = "" } = {}
) => {
  try {
    const { data } = await API.get("/api/v1/ailments", {
      headers: getAuthHeaders(token),
      params: { page, limit, search },
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch ailments");
  }
};

/**
 * Get a single ailment by ID
 * @param {string} token
 * @param {string} id
 * @returns {Promise<Object>}
 */
const getAilmentById = async (token, id) => {
  try {
    const { data } = await API.get(`/api/v1/ailments/${id}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch ailment");
  }
};

/**
 * Create a new ailment
 * @param {string} token - Authentication token
 * @param {Object} ailmentData - Ailment details
 * @returns {Promise<Object>}
 */
const createAilment = async (token, ailmentData) => {
  try {
    const { data } = await API.post("/api/v1/ailments", ailmentData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to create ailment");
  }
};

/**
 * Update an ailment by ID
 * @param {string} token
 * @param {string} id
 * @param {Object} ailmentData
 * @returns {Promise<Object>}
 */
const updateAilment = async (token, id, ailmentData) => {
  try {
    const { data } = await API.put(`/api/v1/ailments/${id}`, ailmentData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to update ailment");
  }
};

/**
 * Delete an ailment by ID
 * @param {string} token
 * @param {string} id
 * @returns {Promise<Object>}
 */
const deleteAilment = async (token, id) => {
  try {
    const { data } = await API.delete(`/api/v1/ailments/${id}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to delete ailment");
  }
};

/**
 * Generate a unique slug for an ailment name
 * @param {string} token
 * @param {string} title
 * @returns {Promise<string|null>} The generated slug or null
 */
const generateSlug = async (token, name) => {
  try {
    const { data } = await API.post(
      "/api/v1/ailments/generate-slug",
      { name },
      { headers: getAuthHeaders(token) }
    );
    return data.slug;
  } catch (error) {
    handleApiError(error, "Failed to generate slug");
    return null;
  }
};

/**
 * Check if a slug is unique
 * @param {string} token
 * @param {string} slug
 * @returns {Promise<Object>} { isUnique: boolean, ... }
 */
const checkSlug = async (token, slug) => {
  try {
    const { data } = await API.get(`/api/v1/ailments/check-slug/${slug}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to check slug");
  }
};

const getAllAilmentsCategoryWise = async () => {
  try {
    const { data } = await API.get("/api/v1/ailments/categories");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getAilmentBySlug = async (token, slug, type) => {
  try {
    const { data } = await API.get(`/api/v1/ailments/slug/${slug}`, {
      headers: getAuthHeaders(token),
      params: {
        type,
      },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
const fetchAilments = async () => {
  try {
    const { data } = await API.get("/api/v1/ailments/name");
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export {
  fetchAilments,
  getAilmentBySlug,
  getAllAilmentsCategoryWise,
  getAllAilments,
  getAilmentById,
  createAilment,
  updateAilment,
  deleteAilment,
  generateSlug,
  checkSlug,
};
