import API from "../services/api";
import { getAuthHeaders } from "../utils";

/**
 * Fetches articles written by a specific writer
 * @param {string} token - Authentication token
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @param {string} [search] - Optional search query
 * @param {string} [status] - Optional article status filter
 * @returns {Promise<Object>} Response data containing articles and pagination info
 * @throws {Error} If the API request fails
 */
const getArticlesByWriterId = async (token, page, limit, search, status) => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const res = await API.get("/api/v1/writer/articles/author", {
      headers: getAuthHeaders(token),
      params: {
        page: page || 1,
        limit: limit || 10,
        search: search || "",
        status: status || "",
      },
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch articles");
    }

    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * Creates a new article
 * @param {string} token - Authentication token
 * @param {Object} articleData - Article data to create
 * @returns {Promise<Object>} Response data containing the created article
 * @throws {Error} If the API request fails
 */
const createArticle = async (token, articleData) => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  if (!articleData || typeof articleData !== "object") {
    throw new Error("Article data is required");
  }

  try {
    const res = await API.post("/api/v1/writer/articles", articleData, {
      headers: getAuthHeaders(token),
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to create article");
    }

    return res.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to create article"
      );
    }
    throw new Error("Network error occurred");
  }
};

const checkSlug = async (token, slug) => {
  try {
    const res = await API.get(`/api/v1/writer/articles/check-slug/${slug}`, {
      headers: getAuthHeaders(token),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const deleteArticle = async (token, id) => {
  try {
    const res = await API.delete(`/api/v1/writer/articles/${id}`, {
      headers: getAuthHeaders(token),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const generateSlug = async (token, title) => {
  try {
    const res = await API.post(
      "/api/v1/writer/articles/generate-slug",
      { title },
      {
        headers: getAuthHeaders(token),
      }
    );

    return res.data.slug;
  } catch (error) {
    error.response.data;
  }
};

/**
 * Fetches articles written by a specific writer
 * @param {string} token - Authentication token
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @param {string} [search] - Optional search query
 * @param {string} [status] - Optional article status filter
 * @returns {Promise<Object>} Response data containing articles and pagination info
 * @throws {Error} If the API request fails
 */
const getAllArticles = async (page, limit, search) => {
  try {
    const res = await API.get("/api/v1/articles", {
      params: {
        page: page || 1,
        limit: limit || 10,
        search: search || "",
      },
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch articles");
    }

    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const getArticleBySlug = async (slug) => {
  try {
    const res = await API.get(`/api/v1/articles/${slug}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export {
  getArticleBySlug,
  getArticlesByWriterId,
  deleteArticle,
  getAllArticles,
  generateSlug,
  createArticle,
  checkSlug,
};
