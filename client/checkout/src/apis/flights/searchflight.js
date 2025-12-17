import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";

export const searchFlights = async ({
  from,
  to,
  date,
  flightId = "",
  providerId = "",
}) => {
  const response = await httpRequest("get", `/api/flights/search`, {
    from,
    to,
    date,
    flightId,
    providerId,
  });
  if (response?.status) {
    useBookingStore.setState((state) => ({
      ...state,
      selectedFlight: response.data?.flights || {},
    }));
  }
  return response.data;
};
