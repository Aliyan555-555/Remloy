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

export {
  formatDate
};
