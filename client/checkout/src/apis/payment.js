import axios from "axios";
import httpRequest from "../helper/httpMethods.js";
import { useLoaderStore } from "store/loaderStore";

export const createOrder = async (payload) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("post", `/api/payment/create`, payload);
    if (response?.data && response?.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.log("error in While Payment", err);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const verifyPayment = async (payload) => {
  try {
    useLoaderStore.getState().setLoading(true);
    const response = await httpRequest(
      "post",
      `/api/payment/verify-payment`,
      payload
    );
    if (response?.data && response?.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.log("error in verify Payment", err);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
