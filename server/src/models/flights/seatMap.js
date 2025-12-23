import mongoose from "mongoose";

const SeatMapSchema = new mongoose.Schema(
  {
    flightInstanceKey: { type: String },
    itineraryKey: { type: String },
    flightNumber: String, // "6E123"
    airlineCode: String, // "AI", "6E"
    departureDate: Date, // Date of flight
    arrivalDate: Date, // Date of flight
    aircraftCode: String, // "73J"
    cabin: { type: String, enum: ["ECONOMY", "BUSINESS"], default: "ECONOMY" },
    seatLayout: [
      {
        cabin: { type: String, enum: ["ECONOMY", "BUSINESS"] },
        rows: Number,
        columns: [String],
        seatPricing: {
          window: Number,
          aisle: Number,
          middle: Number,
          extraLegroom: Number,
        },
      },
    ],
    seatStatus: {
      type: Map, // key: ECONOMY, BUSINESS
      of: {
        type: Map, // key: 1A, 1B, 1C
        of: {
          type: String,
          enum: ["available", "reserved"],
          default: "available",
        },
      },
      default: {},
    },
  },
  { collection: "seatmap" }
);

SeatMapSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 }); // 1 day

export default mongoose.model("seatmap", SeatMapSchema);
