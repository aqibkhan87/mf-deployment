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
  try {
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
  } catch (error) {
    console.error("Error searching flights:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
