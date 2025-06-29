import API from "../services/api";
import { getAuthHeaders } from "../utils";

const subscribeFreePlan = async (token, id, paymentIntent, navigate, force) => {
  try {
    const { data } = await API.post(
      `/api/v1/subscription/plan/${id}`,
      paymentIntent,
      {
        headers: getAuthHeaders(token),
        params: force && {
          force,
        },
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

      if (data.success) {
        navigate(data.redirectUrl);
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

const generateReceipt = async (token, id) => {
  try {
    const { data } = await API.get(
      `/api/v1/subscription/download/receipt/${id}`,
      {
        headers: getAuthHeaders(token),
        responseType: "blob",
      }
    );
    const blob = new Blob([data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    console.log(url);
    link.href = url;
    link.setAttribute("download", "subscription_receipt.pdf");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    return error.response.data;
  }
};

export {
  subscribeFreePlan,
  generateReceipt,
  preprepareForSubscription,
  reCheckInSuccess,
};
