import { AIRCRAFT_FAMILY_MAP } from "./aircraftFamily.js";
import { AIRCRAFT_DATA } from "./aircraftData.js";
import SeatMapModel from "../../models/flights/seatMap.js";

const getAircraftLayout = (aircraftCode) => {
  // Find family for this code
  const familyCode = AIRCRAFT_FAMILY_MAP[aircraftCode] || "A320";
  // Return layout from aircraft data
  return AIRCRAFT_DATA.find((a) => a.code === familyCode);
};

const createSeatMapForSegment = (segment) => {
  const layout = getAircraftLayout(segment?.aircraftCode);
  if (!layout) return null; // fallback if layout not found

  const seatStatus = {};
  layout?.cabins?.forEach((cabin) => {
    seatStatus[cabin.cabin] = {};
    Array.from({ length: cabin.rows }, (_, i) => i + 1).forEach((row) => {
      cabin.columns.forEach((col) => {
        const seatLabel = `${row}${col}`;
        seatStatus[cabin.cabin][seatLabel] = {
          status: "available",
          passengerId: null,
          reservedAt: null,
        };
      });
    });
  });

  return {
    flightNumber: segment?.flightNumber,
    airlineCode: segment?.carrierCode,
    departureDate: segment?.departureTime,
    arrivalDate: segment?.arrivalTime,
    aircraftCode: segment?.aircraftCode,
    cabin: segment?.cabin,
    code: layout?.code,
    seatLayout: layout?.cabins,
    seatStatus,
    flightInstanceKey: `${segment.carrierCode}-${segment.flightNumber}-${
      segment.departureTime.split(".")[0]
    }-${segment.departureAirport}-${segment.arrivalAirport}`,
    itineraryKey: segment?.itineraryKey,
  };
};

export const createSeatMapsForFare = (fare) => {
  let itineraryKey = fare?.segments
    ?.map(
      (s) =>
        `${s?.carrierCode}-${s?.flightNumber}-${s?.departureTime.split(".")[0]}`
    )
    .join("_");
  const seatMapForFare =
    fare?.segments?.flatMap((seg) =>
      createSeatMapForSegment({ ...seg, itineraryKey: itineraryKey })
    ) || [];
  return seatMapForFare;
};

export const createSeatMapsForFlight = async (flights) => {
  const allSeatMaps = flights?.fares?.flatMap((fare) =>
    createSeatMapsForFare(fare)
  );
  try {
    const response = await SeatMapModel.insertMany(allSeatMaps);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export default createSeatMapsForFlight;
