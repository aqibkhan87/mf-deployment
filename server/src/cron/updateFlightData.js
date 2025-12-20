import cron from "node-cron";
import fetchTodayFlights from "../services/amadeus.js";

cron.schedule(
  "0 6 * * *",
  async () => {
    console.log("🛫 Fetching flights for Today.....");
    await fetchTodayFlights();
    console.log("🎯 Flight data for Today updated.");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
