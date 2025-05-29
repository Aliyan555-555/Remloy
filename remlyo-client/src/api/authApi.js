import API from "../services/api";

const verifyEmailToken = async (token, navigate) => {
  try {
    const res = await API.post(`/api/v1/auth/verify-email/${token}`);

    if (!res.data.success) {
   
      navigate("/");
      return;
    }
  } catch (error) {
 
  }
};

const sendEmailVerification = async (setLoading, setMessage) => {
  try {
    const email = localStorage.getItem("signupEmail");
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
export { verifyEmailToken, sendEmailVerification };
