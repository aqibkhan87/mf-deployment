import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const getCheckinDetails = async ({ PNR, emailOrLastName }) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "get",
      `/api/flights/checkin/retrieve-pnr`,
      {
        PNR,
        emailOrLastName,
      }
    );
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
    const response = await httpRequest(
      "post", // using get,becoz we can send multiple passenger ids
      `/api/flights/checkin/passengers-addons/${bookingId}`,
      {
        passengerIds: localStorage.getItem("c_p")
          ? JSON.parse(localStorage.getItem("c_p"))
          : [],
        isAll: localStorage.getItem("isAll")
          ? JSON.parse(localStorage.getItem("isAll"))
          : false,
      }
    );
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

export const updateCheckinAddonsInPassengers = async ({ passengers }) => {
  useLoaderStore.getState().setLoading(true);
  const bookingId = localStorage.getItem("bookingId")
    ? JSON.parse(localStorage.getItem("bookingId"))
    : "";

  try {
    const response = await httpRequest(
      "put",
      `/api/flights/checkin/update-passengers-addons`,
      { passengers, bookingId }
    );
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        checkinDetails: response.data?.checkinDetails || {},
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error while update addons in checkinDetails:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const updateCheckinSeatSelectionInBooking = async (payload) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "put",
      `/api/flights/checkin/update-passengers-seats`,
      payload
    );
    return response?.data;
  } catch (error) {
    console.error("Error while update addons in checkinDetails:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const checkinPaymentForPassengers = async (payload) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "put",
      `/api/flights/checkin/payment`,
      payload
    );
    if (response?.data && response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error while update addons in checkinDetails:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const verifyCheckinPayment = async (payload) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "put",
      `/api/flights/checkin/verify-payment`,
      payload
    );
    if (response?.data && response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error while verify payments in checkinDetails:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const downloadBoardingPDF = async (pdfURL) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "get",
      `/api/flights/checkin/download/${pdfURL}`,
    );
    if (response?.data && response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error while Downloading PDF: ", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
