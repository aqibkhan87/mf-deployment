import cron from "node-cron";
import fetchTodayFlights from "../services/amadeus.js";

cron.schedule("0 0 * * *", async () => {
  console.log("🛫 Fetching flights for Today.....");
  await fetchTodayFlights();
  console.log("🎯 Flight data for Today day updated.");
});
