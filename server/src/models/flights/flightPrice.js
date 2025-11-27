import mongoose from "mongoose";

const segmentSchema = new mongoose.Schema(
  {
    carrierCode: String,
    flightNumber: String,
    aircraftCode: String,
    departureAirport: String,
    arrivalAirport: String,
    departureTime: Date,
    arrivalTime: Date,
    duration: String, // e.g. "PT3H55M"
    cabin: String,
    class: String,
  },
  { _id: false }
);

const fareSchema = new mongoose.Schema(
  {
    providerOfferId: String, // Amadeus "id"
    validatingAirline: String,
    totalPrice: Number,
    basePrice: Number,
    currency: String,
    duration: String,
    segments: [segmentSchema],
  },
  { _id: false }
);

const flightPriceSchema = new mongoose.Schema(
  {
    origin: { type: String, required: true, index: true },
    destination: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    fares: [fareSchema],
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    collection: "flightPrices",
  }
);

// Unique constraint: one record per origin/destination/date
flightPriceSchema.index({ origin: 1, destination: 1, date: 1 }, { unique: true });

// Optional auto-expiration: delete old records (after 2 days)
flightPriceSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 60 * 60 }); // 2 days

export default mongoose.model("FlightPrice", flightPriceSchema);
