import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const createBooking = async (payload) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "post",
      `/api/flights/bookings`,
      payload
    );
    if (response?.data) {
      useBookingStore.setState((state) => ({
        ...state,
        bookingId: response.data?.bookingId || null,
      }));
      localStorage.setItem("bookingId", response.data?.bookingId);
    }
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const getBookingDetails = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";
  const bookingId = localStorage.getItem("bookingId")
    ? JSON.parse(localStorage.getItem("bookingId"))
    : "";
    
  useLoaderStore.getState().setLoading(true);
  try {
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
  } catch (error) {
    console.error("Error fetching booking details:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
