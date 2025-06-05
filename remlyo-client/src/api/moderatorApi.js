import API from "../services/api";
import { getAuthHeaders } from "../utils";

const getComments = async (
  token,
  page = 1,
  limit,
  search,
  status,
  sortBy,
  sortOrder,
  upvoteOrder
) => {
  try {
    const res = await API.get("/api/v1/moderator/comments", {
      headers: getAuthHeaders(token),
      params: {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
        upvoteOrder,
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const getFlags = async (token, page, limit, search) => {
  try {
    const res = await API.get("/api/v1/moderator/flags", {
      headers: getAuthHeaders(token),
      params: {
        page,
        limit,
        search,
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const moderateFlag = async (token, flagId, status, resolutionNote) => {
  try {
    const res = await API.post(`/api/v1/moderator/flags/${flagId}`,
      {
        status,
        resolutionNote,
      },
      {
        headers: getAuthHeaders(token),
      }
    );
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
export { getComments, getFlags,moderateFlag };
