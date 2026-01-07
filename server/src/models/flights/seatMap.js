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
    cabin: { type: String, enum: ["ECONOMY", "BUSINESS", "PREMIUM_ECONOMY"], default: "ECONOMY" },
    seatLayout: [
      {
        cabin: { type: String, enum: ["ECONOMY", "BUSINESS", "PREMIUM_ECONOMY"] },
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
      type: Map, // key: ECONOMY, BUSINESS, PREMIUM_ECONOMY
      of: {
        type: Map, // key: 1A, 1B, 1C
        of: {
          status: String, // "reserved", "available"
          passengerId: String, // "12j43-434jff-343dff-34dfs"
          reservedAt: Date, // 12-12-2025
        },
      },
      default: {},
    },
  },
  { collection: "seatmap" }
);

SeatMapSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 }); // 1 day

const SeatMapModel = mongoose.model("seatmap", SeatMapSchema);
export default SeatMapModel;
