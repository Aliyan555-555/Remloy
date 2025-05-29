import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // Add other default headers here if needed
  },
  withCredentials: true, // Send cookies if your backend uses them
});

export default API;
