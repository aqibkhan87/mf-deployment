import mongoose from "mongoose";

const PassengerSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    isAdult: { type: Boolean, default: true },
    isInfant: { type: Boolean, default: false },
    addons: [{ type: mongoose.Schema.Types.ObjectId, ref: "addons" }],
    seat: {
      seatNumber: String, // "12A"
      cabin: String, // ECONOMY
      price: Number,
      seatType: { type: String, enum: ["window", "aisle", "middle"] },
    },
  },
  {
    _id: false,
  }
);

const PaymentSchema = new mongoose.Schema(
  {
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
  },
  {
    _id: false,
  }
);

const BookingSchema = new mongoose.Schema(
  {
    flightDetail: Object,
    providerId: String,

    sourceIATA: String,
    destinationIATA: String,
    sourceAirport: Object,
    destinationAirport: Object,
    passengerCount: Number,

    passengers: [PassengerSchema],
    contact: {
      email: String,
      mobile: String,
    },

    priceBreakdown: {
      basePrice: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      addonsPrice: { type: Number, default: 0 },
      finalPrice: { type: Number, default: 0 },
      seatsPrice: { type: Number, default: 0 },
    },

    paymentRequired: { type: Boolean, default: true },
    payment: PaymentSchema,

    bookingStatus: {
      type: String,
      enum: [
        "IN_PROGRESS",
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CANCELLED",
        "FAILED",
      ],
      default: "IN_PROGRESS",
    },
  },
  { timestamps: true, collection: "booking" }
);

export default mongoose.model("Booking", BookingSchema);
