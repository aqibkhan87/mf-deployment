import cron from "node-cron";
import dayjs from "dayjs";
import Flight from "../models/flights.js";
import { fetchAllFlightsForDate } from "../services/aviationStack.js";

const NEXT_DAYS = 14;

cron.schedule("0 3 * * *", async () => {
  console.log("🛫 Fetching flights for next 14 days...");

  const today = dayjs();

  for (let i = 0; i < NEXT_DAYS; i++) {
    const date = today.add(i, "day").format("YYYY-MM-DD");

    try {
      const flights = await fetchAllFlightsForDate(date);

      // Delete old data for that date
      await Flight.deleteMany({ flight_date: date });

      // Insert new data
      await Flight.insertMany(flights);
      console.log(`✅ Stored ${flights.length} flights for ${date}`);
    } catch (err) {
      console.error(`❌ Error for ${date}:`, err.message);
    }
  }

  console.log("🎯 Flight data for 14 days updated.");
});
