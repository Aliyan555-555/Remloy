import API from "../services/api";
import { getAuthHeaders } from "../utils";

const createPaymentInstance = async (token,paymentData) => {
    try {
        const { data } = await API.post('/api/v1/payment/create-payment-intent', paymentData, {
            headers: getAuthHeaders(token),
        });
        return data;
    } catch (error) {
        return error.response.data;
    }
}




export {
    createPaymentInstance
}