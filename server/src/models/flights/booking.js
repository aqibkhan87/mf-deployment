import mongoose from "mongoose";

/* =========================
   Passenger Schema
========================= */
const PassengerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  isAdult: { type: Boolean, default: true },
  isInfant: { type: Boolean, default: false },
});

/* =========================
   Payment Schema
========================= */
const PaymentSchema = new mongoose.Schema({
  gateway: { type: String, default: "RAZORPAY" },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["CREATED", "PAID", "FAILED", "REFUNDED", "NOT_REQUIRED"],
    default: "CREATED",
  },
  paidAt: Date,
});

/* =========================
   Booking Schema
========================= */
const BookingSchema = new mongoose.Schema(
  {
    // ---- Flight info ----
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: "FlightPrice" },
    providerId: String,

    source: String,
    destination: String,
    travelDate: String,
    passengerCount: Number,

    // ---- User ----
    contact: {
      email: String,
      phone: String,
    },

    passengers: [PassengerSchema],

    // ---- Pricing ----
    priceBreakdown: {
      basePrice: Number,
      taxes: Number,
      discountApplied: Number,
      finalPrice: Number,
      promoCodes: [String],
    },

    // ---- Payment ----
    paymentRequired: { type: Boolean, default: true },
    payment: PaymentSchema,

    // ---- Booking status ----
    bookingStatus: {
      type: String,
      enum: [
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CANCELLED",
        "FAILED",
      ],
      default: "PENDING_PAYMENT",
    },

    // ---- Airline-style identifiers ----
    bookingRef: { type: String, unique: true }, // like PNR
  },
  { timestamps: true, collection: "booking" }
);

// Generate bookingRef before save
BookingSchema.pre("save", function (next) {
  if (!this.bookingRef) {
    this.bookingRef = "BK" + Date.now().toString().slice(-8);
  }
  next();
});

export default mongoose.model("Booking", BookingSchema);
