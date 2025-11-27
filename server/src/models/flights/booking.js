import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    flightRef: { type: mongoose.Schema.Types.ObjectId, ref: "FlightPrice" },
    providerFlightId: String,
    passengerName: String,
    email: String,
    phone: String,
    source: String,
    destination: String,
    date: String,
    basePrice: Number,
    discountApplied: Number,
    finalPrice: Number,
    promoCode: String,
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "booking",
  }
);

export default mongoose.model("booking", schema);
