import { AIRCRAFT_FAMILY_MAP } from "./aircraftFamily.js";
import { AIRCRAFT_DATA } from "./aircraftData.js";
import SeatMapModel from "../../models/flights/seatMap.js";

const getAircraftLayout = (aircraftCode) => {
  // Find family for this code
  const familyCode = AIRCRAFT_FAMILY_MAP[aircraftCode] || aircraftCode;
  // Return layout from aircraft data
  return AIRCRAFT_DATA.find((a) => a.code === familyCode);
};

const createSeatMapForSegment = (segment) => {
  const layout = getAircraftLayout(segment.aircraftCode);
  if (!layout) return null; // fallback if layout not found

  const seatStatus = {};
  layout?.cabins?.forEach((cabin) => {
    seatStatus[cabin.cabin] = {};
    Array.from({ length: cabin.rows }, (_, i) => i + 1).forEach((row) => {
      cabin.columns.forEach((col) => {
        const seatLabel = `${row}${col}`;
        seatStatus[cabin.cabin][seatLabel] = "available"; // default
      });
    });
  });

  return {
    flightNumber: segment.flightNumber,
    airlineCode: segment.carrierCode,
    departureDate: segment.departureTime,
    aircraftCode: segment.aircraftCode,
    cabin: segment.cabin,
    code: layout.code,
    seatLayout: layout?.cabins,
    seatStatus,
    flightInstanceKey: `${segment.carrierCode}-${segment.flightNumber}-${segment.departureTime}-${segment.departureAirport}-${segment.arrivalAirport}`,
  };
};

export const createSeatMapsForFare = (fare) => {
  return fare?.segments?.map((segment) => createSeatMapForSegment(segment));
};

export const createSeatMapsForFlight = async (flights) => {
  const allSeatMaps = [];
  flights?.forEach((flight) => {
    const seatMaps = createSeatMapsForFare(flight);
    allSeatMaps.push(...seatMaps);
  });
  const response = await SeatMapModel.insertMany(allSeatMaps);
  return response;
};

export default createSeatMapsForFlight;
