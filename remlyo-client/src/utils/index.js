/**
 * Formats a date string or Date object into a readable format (e.g., "Jun 10, 2024").
 * @param {string|Date} inputDate - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(inputDate) {
  if (!inputDate) return "";
  const date = new Date(inputDate);
  if (isNaN(date)) return "";
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Helper to build auth headers
 * @param {string} token
 * @returns {Object}
 */
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * Handles API errors and returns a consistent error object
 * @param {any} error
 * @param {string} defaultMessage
 * @returns {Object}
 */
const handleApiError = (error, defaultMessage) =>
  error?.response?.data || {
    success: false,
    message: defaultMessage,
    error: error?.message || "Network error",
  };

export { handleApiError, formatDate, getAuthHeaders };
