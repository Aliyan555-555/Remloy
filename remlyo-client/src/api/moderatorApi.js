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
    upvoteOrder) => {
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

export {
    getComments,
}