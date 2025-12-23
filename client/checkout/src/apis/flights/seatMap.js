import httpRequest from "../../helper/httpMethods";
import { useBookingStore } from "store/bookingStore";
import { useLoaderStore } from "store/loaderStore";

export const getSeatMaps = async (itineraryKey) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/flights/seatmap`, {
      itineraryKey,
    });
    if (response?.status) {
      useBookingStore.setState((state) => ({
        ...state,
        seatMaps: response.data?.seatMaps || {},
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error searching seatMap:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
