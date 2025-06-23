import { getAuthHeaders } from "../utils";
import API from "./../services/api";

const getAllPlans = async (token) => {
  try {
    const res = await API.get("/api/v1/pricing", {
      headers: getAuthHeaders(token),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export { getAllPlans };
