import API from "../services/api";

const generateHealthProfileQuestions = async (healthData, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.post(
      "/api/v1/user/health-profile/generate",
      healthData,
      {
        headers,
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
const healthProfile = async (healthProfileData, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.post(
      "/api/v1/user/health-profile",
      healthProfileData,
      { headers }
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const checkHealthProfile = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await API.get("/api/v1/user/health-profile/status", {
      headers,
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
const checkSubscription = async () => {};

export {
  generateHealthProfileQuestions,
  healthProfile,
  checkHealthProfile,
  checkSubscription,
};
