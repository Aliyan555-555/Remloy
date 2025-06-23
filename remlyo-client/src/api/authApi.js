import API from "../services/api";
import { getAuthHeaders } from "../utils";

const verifyEmailToken = async (token, navigate) => {
  try {
    const res = await API.post(`/api/v1/auth/verify-email/${token}`);

    if (!res.data.success) {
      navigate("/");
      return;
    }
  } catch (error) {}
};

const sendEmailVerification = async (setLoading, setMessage, email) => {
  try {
    const res = await API.post(`/api/v1/auth/verify-email`, { email });
    setLoading(false);
    if (!res.data.success) {
      setMessage(res.data.message);
    }
    return res.data;
  } catch (error) {
    setMessage(error.response.data.message);
    setLoading(false);
    return error.response.data;
  }
};
const refreshUser = async (token) => {
  try {
    const { data } = await API.get("/api/v1/auth/refresh", {
      headers: getAuthHeaders(token),
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export { verifyEmailToken, sendEmailVerification, refreshUser };
