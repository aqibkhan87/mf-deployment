import { useAuthStore } from "store/authStore";
import httpRequest from "../helper/httpMethods";

export const getAllAddresses = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest("get", `/api/addresses?userId=${userId}`);

  if (response?.data?.success) {
    useAuthStore.setState((state) => ({
      ...state,
      addresses: response.data?.addresses || [],
    }));
  }
};

export const addNewAddress = async (payload) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "post",
    `/api/addresses/add?userId=${userId}`,
    JSON.stringify(payload)
  );
  if (response?.data && response?.data?.success) {
    getAllAddresses();
  }
};