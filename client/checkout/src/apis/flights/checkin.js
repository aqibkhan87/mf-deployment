import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const getCheckinDetails = async ({ PNR, emailOrLastName }) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/checkin/retrieve`, {
      PNR,
      emailOrLastName
    });
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        checkinDetails: response.data?.checkinDetails || {},
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error searching checkinDetails:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
