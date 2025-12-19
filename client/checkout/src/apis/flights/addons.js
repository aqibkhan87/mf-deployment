import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const getAddons = async () => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/addons`);
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        addons: response.data?.addons || [],
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching addons:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
