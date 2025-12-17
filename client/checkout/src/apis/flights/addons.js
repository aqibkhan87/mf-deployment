import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";

export const getAddons = async () => {
  const response = await httpRequest("get", `/api/flights/addons`);
  if (response?.status) {
    useBookingStore.setState((state) => ({
      ...state,
      addons: response.data?.addons || [],
    }));
  }
  return response.data;
};
