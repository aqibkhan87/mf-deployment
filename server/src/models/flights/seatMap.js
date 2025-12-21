import mongoose from "mongoose";

const SeatMapSchema = new mongoose.Schema(
  {
    flightInstanceKey: { type: String, unique: true, index: true },
    flightNumber: String, // "6E123"
    airlineCode: String, // "AI", "6E"
    departureDate: Date, // Date of flight
    aircraftCode: String, // "73J"
    cabin: { type: String, enum: ["ECONOMY", "BUSINESS"], default: "ECONOMY" },
    seatLayout: [],
    code: String,
    seatStatus: {
      type: Map,
      of: { type: String, enum: ["available", "reserved"], default: "available" }, // selected seats will only be on frontend
    },
  },
  { collection: "seatmap" }
);

SeatMapSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 }); // 1 day

export default mongoose.model("seatmap", SeatMapSchema);
