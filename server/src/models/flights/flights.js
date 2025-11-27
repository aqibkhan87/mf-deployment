// models/Flight.js
import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flight_date: String,
    flight_number: String,
    airline: {
      name: String,
      iata: String,
      icao: String,
    },
    departure: {
      airport: String,
      iata: String,
      scheduled: Date,
    },
    arrival: {
      airport: String,
      iata: String,
      scheduled: Date,
    },
    aircraft: {
      registration: String,
      iata: String,
    },
    price: Number, // we will add our own price logic (since Aviationstack doesn't give it)
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "flight",
  }
);

export default mongoose.model("flight", flightSchema);
