function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export { formatDate };
