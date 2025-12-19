import httpRequest from "../helper/httpMethods";
import { useAuthStore } from "store/authStore";
import { useLoaderStore } from "store/loaderStore";

export const getAllAddresses = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "get",
      `/api/addresses?userId=${userId}`
    );

    if (response?.data?.success) {
      useAuthStore.setState((state) => ({
        ...state,
        addresses: response.data?.addresses || [],
      }));
    }
  } catch (error) {
    console.error("Error fetching addresses:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const addNewAddress = async (payload) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "post",
      `/api/addresses/add?userId=${userId}`,
      JSON.stringify(payload)
    );
    if (response?.data && response?.data?.success) {
      getAllAddresses();
    }
  } catch (error) {
    console.error("Error adding new address:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
