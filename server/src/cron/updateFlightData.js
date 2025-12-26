import cron from "node-cron";
import fetchTodayFlights from "../services/amadeus.js";
import { deleteYesterdayFlightData, deleteYesterdaySeatMapData } from "./deleteFlightData.js";

cron.schedule(
  "0 6 * * *",
  async () => {
    console.log("🛫 Delete All SeatMap Data.....");
    // await deleteAllSeatMapData();
    await deleteYesterdaySeatMapData();
    console.log("🛫 Delete All Flight data.....");
    // await deleteAllFlightData();
    await deleteYesterdayFlightData();
    console.log("🛫 Fetching flights for Today.....");
    await fetchTodayFlights();
    console.log("🎯 Flight data for Today updated.");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
