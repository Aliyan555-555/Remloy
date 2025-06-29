import API from "../services/api";
import { getAuthHeaders, handleApiError } from "../utils";
// import { getAuthHeaders } from "../utils";

/**
 * Get all remedies with pagination
 * @param {string} token
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @returns {Promise<Object>}
 */
const getAllRemedies = async ({ page = 1, limit = 10, search = "" } = {}) => {
  try {
    const { data } = await API.get("/api/v1/remedy", {
      params: { page, limit, search },
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch remedies");
  }
};

const getRemedyById = async (token, id, ailmentId) => {
  try {
    const { data } = await API.get(`/api/v1/remedy/${id}`, {
      headers: getAuthHeaders(token),
      params: ailmentId
        ? {
            id: ailmentId,
          }
        : undefined,
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const updateRemedy = async (token, id, remedyData) => {
  try {
    const { data } = await API.put(`/api/v1/remedy/${id}`, remedyData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getRemediesByAilmentAndType = async (
  ailmentId,
  type,
  currentPage,
  sort
) => {
  try {
    const { data } = await API.get(`/api/v1/remedy/ailment/${ailmentId}`, {
      params: {
        type,
        sort,
        page: currentPage,
      },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getAIfeedback = async (token, id) => {
  try {
    const { data } = await API.get(`/api/v1/remedy/ai/feedback/${id}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * Generate an AI remedy based on symptoms
 * @param {string} token - Authentication token
 * @param {string} symptoms - User's symptoms description
 * @returns {Promise<Object>} Generated remedy or error
 */
const generateAIRemedy = async (token, ailmentId, symptoms) => {
  try {
    const { data } = await API.post(
      `/api/v1/remedy/ai/ailment/${ailmentId}/remedy`,
      { symptoms },
      { headers: getAuthHeaders(token) }
    );
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to generate AI remedy");
  }
};

export {
  getAllRemedies,
  getRemedyById,
  getAIfeedback,
  updateRemedy,
  getRemediesByAilmentAndType,
  generateAIRemedy,
};
