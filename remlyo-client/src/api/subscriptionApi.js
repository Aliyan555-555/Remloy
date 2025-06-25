import API from "../services/api";
import { getAuthHeaders } from "../utils";

const subscribeFreePlan = async (token, id, navigate) => {
  try {
    const { data } = await API.post(
      `/api/v1/subscription/plan/${id}`,
      {},
      {
        headers: getAuthHeaders(token),
      }
    );
    if (data.success) {
      navigate(`/checkout/${data.data.plan}/success`, { replace: true });
    }
    return data;
  } catch (error) {
    return error.response.data;
  }
};

const preprepareForSubscription = async (token, id, navigate) => {
  try {
    const { data } = await API.get(`/api/v1/subscription/pre/${id}`, {
      headers: getAuthHeaders(token),
    });

    if (data.success) {
      if (data.isFreePlan) {
        await subscribeFreePlan(token, id, navigate);
        return;
      }

      if (data.success){
        navigate(data.redirectUrl)
      }

      return data;
    }
  } catch (error) {
    return error.response.data;
  }
};

const reCheckInSuccess = async (token, id) => {
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
