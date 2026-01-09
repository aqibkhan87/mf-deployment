import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const fetchAirports = async () => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/airports`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching airports:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const searchAirports = async (q) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "get",
      `/api/flights/airports/search?q=${encodeURIComponent(q)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error while search Airports:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const searchFlights = async ({ from, to, date, promo }) => {
  useLoaderStore.getState().setLoading(true);
  let response;
  try {
    response = await httpRequest("get", `/api/flights/search`, {
      from,
      to,
      date,
      promo,
    });
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        selectedFlight: response.data?.flights || {},
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error while search Airports:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
    if (response?.data?.sourceAirport || response?.data?.destinationAirport) {
      useBookingStore.setState((state) => ({
        ...state,
        sourceAirport: response.data?.sourceAirport || {},
        destinationAirport: response.data?.destinationAirport || {},
      }));
    }
  }
};

export const getDestinationList = async () => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/search/list`);
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        destinationListDetails: response.data || {},
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error while search Airports:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
