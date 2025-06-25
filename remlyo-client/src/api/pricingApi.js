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

const getPlan = async (id) => {
  try {
    const { data } = await API.get(`/api/v1/pricing/${id}`);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getPlanStats = async (token) => {
  try {
    const res = await API.get("/api/v1/pricing/stats/overview", {
      headers: getAuthHeaders(token),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const checkPlanEligibility = async (planId, token) => {
  try {
    const res = await API.get(`/api/v1/pricing/${planId}/eligibility`, {
      headers: getAuthHeaders(token),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export { getAllPlans, getPlan, getPlanStats, checkPlanEligibility };
