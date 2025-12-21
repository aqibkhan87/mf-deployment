import FlightPriceModel from "../models/flights/flightPrice.js";
import SeatMapModel from "../models/flights/seatMap.js";

export const deleteAllFlightData = async () => {
  console.log("Deleting all existing Flight data...");
  await FlightPriceModel.deleteMany({});
}

export const deleteAllSeatMapData = async () => {
  console.log("Deleting all existing SeatMap data...");
  await SeatMapModel.deleteMany({});
}