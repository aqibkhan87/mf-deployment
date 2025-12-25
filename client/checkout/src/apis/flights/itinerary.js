import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const getItineraryDetails = async ({ orderId, status, PNR }) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/itinerary`, {
      orderId, status, PNR,
    });
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        itineraryDetails: response.data?.itineraryDetails || {},
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error searching itineraryDetails:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
