import API from "../services/api";
import { getAuthHeaders, handleApiError } from "../utils";


/**
 * Get all users with pagination and filters
 * @param {string} token - Authentication token
 * @param {Object} options - Query options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string} [options.search]
 * @param {string} [options.role]
 * @param {string} [options.lastActive]
 * @returns {Promise<Object>}
 */
const getAllUsers = async (
  token,
  { page = 1, limit = 10, search = "", role = "", lastActive = "" } = {}
) => {
  try {
    const { data } = await API.get("/api/v1/admin/users", {
      headers: getAuthHeaders(token),
      params: { page, limit, search, role, lastActive },
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch users");
  }
};

/**
 * Delete a user by ID
 * @param {string} token
 * @param {string} id
 * @returns {Promise<Object>}
 */
const deleteUser = async (token, id) => {
  try {
    const { data } = await API.delete(`/api/v1/admin/users/${id}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to delete user");
  }
};

/**
 * Update user account status
 * @param {string} token
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const userAccountStatus = async (token, userData) => {
  try {
    const { data } = await API.post("/api/v1/admin/users/status", userData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to update user status");
  }
};

/**
 * Get all remedies with pagination
 * @param {string} token
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @returns {Promise<Object>}
 */
const getAllRemedies = async (
  token,
  { page = 1, limit = 10, search = "" } = {}
) => {
  try {
    const { data } = await API.get("/api/v1/remedy", {
      headers: getAuthHeaders(token),
      params: { page, limit, search },
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch remedies");
  }
};

/**
 * Delete a remedy by ID
 * @param {string} token
 * @param {string} id
 * @returns {Promise<Object>}
 */
const deleteRemedy = async (token, id) => {
  try {
    const { data } = await API.delete(`/api/v1/remedy/${id}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to delete remedy");
  }
};

/**
 * Moderate a remedy
 * @param {string} token
 * @param {string} id
 * @param {Object} moderateRemedyData
 * @returns {Promise<Object>}
 */
const moderateRemedy = async (token, id, moderateRemedyData) => {
  try {
    const { data } = await API.patch(
      `/api/v1/admin/moderate/remedy/${id}`,
      moderateRemedyData,
      { headers: getAuthHeaders(token) }
    );
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to moderate remedy");
  }
};

const changeUserRole = async (token, userData) => {
  try {
    const { data } = await API.post("/api/v1/admin/users/role", userData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to change user role");
  }
};

/**
 * Create a new remedy
 * @param {string} token - Authentication token
 * @param {Object} remedyData - Remedy details
 * @returns {Promise<Object>}
 */
const createRemedy = async (token, remedyData) => {
  try {
    const { data } = await API.post("/api/v1/remedy/create", remedyData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to create remedy");
  }
};

export {
  createRemedy,
  getAllUsers,
  deleteUser,
  userAccountStatus,
  changeUserRole,
  getAllRemedies,
  deleteRemedy,
  moderateRemedy,
};
