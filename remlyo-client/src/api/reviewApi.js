import API from "../services/api";
import { getAuthHeaders } from "../utils";

const createReview = async (token, reviewData) => {
  try {
    const { data } = await API.post("/api/v1/review", reviewData, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export { createReview };
