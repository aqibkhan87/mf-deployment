import FlightPriceModel from "../models/flights/flightPrice.js";
import SeatMapModel from "../models/flights/seatMap.js";


const endOfYesterday = new Date();
endOfYesterday.setDate(endOfYesterday.getDate() - 1);
endOfYesterday.setHours(23, 59, 59, 999);

// export const deleteAllFlightData = async () => {
//   console.log("Deleting all existing Flight data...");
//   await FlightPriceModel.deleteMany({});
// };

// export const deleteAllSeatMapData = async () => {
//   console.log("Deleting all existing SeatMap data...");
//   await SeatMapModel.deleteMany({});
// };

export const deleteYesterdayFlightData = async () => {
  console.log("Deleting Yesterday existing Flight data...");
  await FlightPriceModel.deleteMany({
    date: {
      $lte: endOfYesterday,
    },
  });
};

export const deleteYesterdaySeatMapData = async () => {
  console.log("Deleting yesterday existing SeatMap data...");
  await SeatMapModel.deleteMany({
    departureDate: {
      $lte: endOfYesterday,
    },
  });
};