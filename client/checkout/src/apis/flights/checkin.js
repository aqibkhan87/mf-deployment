import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const getCheckinDetails = async ({ PNR, emailOrLastName }) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/checkin/retrieve-pnr`, {
      PNR,
      emailOrLastName,
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

export const getCheckinBookingDetails = async () => {
  useLoaderStore.getState().setLoading(true);
  const bookingId = localStorage.getItem("bookingId")
    ? JSON.parse(localStorage.getItem("bookingId"))
    : "";
    
  try {
    const response = await httpRequest("get", `/api/flights/checkin/passengers-addons/${bookingId}`, {
      passengerIds: localStorage.getItem("c_p") ? JSON.parse(localStorage.getItem("c_p")) : [],
      isAll: localStorage.getItem("isAll") ? JSON.parse(localStorage.getItem("isAll")) : false
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
