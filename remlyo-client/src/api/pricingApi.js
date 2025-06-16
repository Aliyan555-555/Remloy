import API from "./../services/api";


const getAllPlans = async () => {
  try {
    const res = await API.get("/api/v1/pricing");
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export { getAllPlans };
