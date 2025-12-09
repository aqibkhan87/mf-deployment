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

export const markDefaultAddress = async (addressId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "get",
    `/api/addresses/make-default?userId=${userId}&addressId=${addressId}`,
  );
  if (response?.data && response?.data?.success) {
    getAllAddresses();
  }
};

export const editAddress = async (payload) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "put",
    `/api/addresses/edit?userId=${userId}`,
    JSON.stringify(payload)
  );
  if (response?.data && response?.data?.success) {
    getAllAddresses();
    return response.data;
  }
};

export const deleteAddress = async (addressId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "delete",
    `/api/addresses?userId=${userId}&addressId=${addressId}`
  );
  if (response?.data && response?.data?.success) {
    getAllAddresses();
    return response.data;
  }
};
