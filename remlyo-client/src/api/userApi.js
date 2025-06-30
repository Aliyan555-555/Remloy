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
    const { data } = await API.post(
      `/api/v1/user/remedy/save/${id}`,
      {},
      {
        headers: getAuthHeaders(token),
        params: {
          type,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getPaymentHistory = async (token, page, limit) => {
  try {
    const { data } = await API.get("/api/v1/user/payment/history", {
      headers: getAuthHeaders(token),
      params: {
        page,
        limit,
      },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const getPaymentMethods = async (token) => {
  try {
    const { data } = await API.get("/api/v1/user/payment/methods", {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const deleteSaveRemedy = async (token, id, type) => {
  try {
    const { data } = await API.patch(
      `/api/v1/user/remedy/delete/${id}`,
      undefined,
      {
        headers: getAuthHeaders(token),
        params: {
          type,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const addPaymentMethod = async (token, data) => {
  const res = await API.post("/api/v1/user/payment/methods", data, { headers: getAuthHeaders(token) });
  return res.data;
};

const removePaymentMethod = async (token, paymentMethodId) => {
  const res = await API.delete(`/api/v1/user/payment/methods/${paymentMethodId}`, { headers: getAuthHeaders(token) });
  return res.data;
};

const updatePaymentMethod = async (token, paymentMethodId, data) => {
  const res = await API.patch(`/api/v1/user/payment/methods/${paymentMethodId}`, data, { headers: getAuthHeaders(token) });
  return res.data;
};

export {
  getPaymentHistory,
  deleteSaveRemedy,
  generateHealthProfileQuestions,
  healthProfile,
  saveRemedy,
  getPaymentMethods,
  checkHealthProfile,
  checkSubscription,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
};
