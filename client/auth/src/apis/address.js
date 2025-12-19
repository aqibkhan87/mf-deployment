import httpRequest from "../helper/httpMethods";
import { useLoaderStore } from "store/loaderStore";

export const addNewAddress = async (payload) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";
  useLoaderStore.getState().setLoading(true);
  try {
    return await httpRequest(
      "post",
      `/api/addresses/add?userId=${userId}`,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("Error adding new address:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
