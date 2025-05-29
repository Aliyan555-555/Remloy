import API from "../services/api";

/**
 * Get all users with pagination and filters
 * @param {string} token - Authentication token
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {string} search - Search term
 * @param {string} role - Filter by role ('admin' or 'user')
 * @param {string} lastActive - Filter by last active time ('today', 'week', 'month')
 * @returns {Promise<Object>} Response data
 */
const getAllUsers = async (
  token,
  page = 1,
  limit = 10,
  search = "",
  role = "",
  lastActive = ""
) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.get("/api/v1/admin/users", {
      headers,
      params: {
        page,
        limit,
        search,
        role,
        lastActive,
      },
    });
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch users",
        error: "Network error",
      }
    );
  }
};

const deleteUser = async (token, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.delete(`/api/v1/admin/users/${id}`, { headers });
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to delete user",
        error: "Network error",
      }
    );
  }
};

const userAccountStatus = async (token, userData) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.post("/api/v1/admin/users/status", userData, {
      headers,
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllRemedies = async (token, page, limit) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.get("/api/v1/remedy", { headers, params: { page, limit } });
    return data;
  }
  catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch remedies",
        error: "Network error",
      }
    );
  }
}


const deleteRemedy = async (token, id) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.delete(`/api/v1/remedy/${id}`, { headers });
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to delete remedy",
        error: "Network error",
      }
    );
  }
};

const moderateRemedy = async (token, id, moderateRemedyData) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.patch(`/api/v1/admin/moderate/remedy/${id}`, moderateRemedyData, { headers });
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to moderate remedy",
        error: "Network error",
      }
    );
  }
}
export { getAllUsers, deleteUser, userAccountStatus, getAllRemedies, deleteRemedy, moderateRemedy };
