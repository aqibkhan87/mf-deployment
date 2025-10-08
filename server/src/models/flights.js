import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema(
  {
    flight_date: String,
    flight_status: String,
    departure: {
      airport: String,
      timezone: String,
      iata: String,
      scheduled: String,
    },
    arrival: {
      airport: String,
      timezone: String,
      iata: String,
      scheduled: String,
    },
    airline: {
      name: String,
      iata: String,
    },
    flight: {
      number: String,
      iata: String,
    },
    last_updated: { type: Date, default: Date.now },
  },
  {
    collection: "flight",
  }
);

const FlightModel = mongoose.model("flight", FlightSchema);

export default FlightModel;
