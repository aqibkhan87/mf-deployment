import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";

export const createBooking = async (payload) => {
  const response = await httpRequest("post", `/api/flights/bookings`, payload);
  if (response?.data) {
    useBookingStore.setState((state) => ({
      ...state,
      bookingId: response.data?.bookingId || null,
    }));
    localStorage.setItem("bookingId", response.data?.bookingId);
  }
  return response.data;
};

export const getBookingDetails = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";
  const bookingId = localStorage.getItem("bookingId") ? JSON.parse(localStorage.getItem("bookingId")) : "";

  const response = await httpRequest(
    "get",
    `/api/flights/bookings/${bookingId}`
  );

  if (response?.data?.success) {
    useBookingStore.setState((state) => ({
      ...state,
      bookingDetails: response.data?.bookingDetails || [],
    }));
  }
};
