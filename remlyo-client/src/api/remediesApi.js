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

const getRemedyById = async (id) => {
  try {
    const res = await API.get(`/api/v1/remedy/${id}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};


const updateRemedy = async (token, id, remedyData) => {
  try {
    const res = await API.put(`/api/v1/remedy/${id}`, remedyData, { headers: getAuthHeaders(token) });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export { getAllRemedies, getRemedyById, updateRemedy };
