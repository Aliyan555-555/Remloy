import API from "../services/api";
import { getAuthHeaders } from "../utils";

const subscribeFreePlan = async (token, id) => {
  try {
    const { data } = await API.post(
      `/api/v1/subscription/plan/${id}`,
      {},
      {
        headers: getAuthHeaders(token),
      }
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const preprepareForSubscription = async (token, id) => {
  try {
    const { data } = await API.get(`/api/v1/subscription/pre/${id}`, {
      headers: getAuthHeaders(token),
    });

    if (data.success) {
      if (data.isFreePlan) {
        await subscribeFreePlan(token, id);
        // console.log("object");
        return;
      }

      return data;
    }
  } catch (error) {
    return error.response.data;
  }
};

const reCheckInSuccess = async (token,id) => {
  try {
    const { data } = await API.get(`/api/v1/subscription/re-check/${id}`, {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export { subscribeFreePlan, preprepareForSubscription, reCheckInSuccess };
