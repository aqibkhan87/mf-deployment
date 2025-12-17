import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";

export const fetchAirports = async () => {
  const response = await httpRequest("get", `/api/flights/airports`);
  return response.data;
};

export const searchAirports = async (q) => {
  const response = await httpRequest(
    "get",
    `/api/flights/airports/search?q=${encodeURIComponent(q)}`
  );
  return response.data;
};

export const searchFlights = async ({ from, to, date, promo }) => {
  const response = await httpRequest("get", `/api/flights/search`, {
    from,
    to,
    date,
    promo,
  });
  if(response?.status) {
    useBookingStore.setState((state) => ({
      ...state,
      selectedFlight: response.data?.flights || {},
    }));
  }
  return response.data;
};

