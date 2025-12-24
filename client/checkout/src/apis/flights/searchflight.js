import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const searchFlights = async ({
  from,
  to,
  date,
  flightId = "",
  providerId = "",
}) => {
  useLoaderStore.getState().setLoading(true);
  let response;
  try {
    response = await httpRequest("get", `/api/flights/search`, {
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
  } catch (error) {
    console.error("Error searching flights:", error);
  } finally {
    if (response?.data?.destinationAirport || response?.data?.sourceAirport) {
      useBookingStore.setState((state) => ({
        ...state,
        destinationAirport: response.data?.destinationAirport || {},
        sourceAirport: response.data?.sourceAirport || {},
      }));
    }
    useLoaderStore.getState().setLoading(false);
  }
};
