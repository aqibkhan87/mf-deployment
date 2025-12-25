import axios from "axios";
import httpRequest from "../helper/httpMethods.js";

export const createOrder = async (payload) => {
  const response = await httpRequest("post", `/api/payment/create`, payload);
  if (response?.data && response?.status === 200) {
    return response.data;
  }
};

export const verifyPayment = async (payload) => {
  try {
    const response = await httpRequest(
      "post",
      `/api/payment/verify-payment`,
      payload
    );
    if (response?.data && response?.status === 200) {
      return response.data;
    }
  } catch(err) {
    console.log("error in verify Payment", err);
  }
};
