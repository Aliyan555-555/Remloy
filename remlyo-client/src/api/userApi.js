import API from "../services/api";
import { getAuthHeaders } from "../utils";

const generateHealthProfileQuestions = async (healthData, token) => {
  try {
    const { data } = await API.post(
      "/api/v1/user/health-profile/generate",
      healthData,
      {
        headers: getAuthHeaders(token),
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
const healthProfile = async (healthProfileData, token) => {
  try {
    const { data } = await API.post(
      "/api/v1/user/health-profile",
      healthProfileData,
      { headers: getAuthHeaders(token) }
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const checkHealthProfile = async (token) => {
  try {
    const { data } = await API.get("/api/v1/user/health-profile/status", {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
const checkSubscription = async (token) => {
  try {
    const { data } = await API.get("/api/v1/subscription/status", {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};


const saveRemedy = async (token, id, type) => {
  try {
    const { data } = await API.post(`/api/v1/user/remedy/save/${id}`, {}, {
      headers: getAuthHeaders(token),
      params: {
        type
      }
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
}
export {
  generateHealthProfileQuestions,
  healthProfile,
  saveRemedy,
  checkHealthProfile,
  checkSubscription,
};
