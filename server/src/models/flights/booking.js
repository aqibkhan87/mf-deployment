import mongoose from "mongoose";

const PassengerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  isAdult: { type: Boolean, default: true },
  isInfant: { type: Boolean, default: false },
});

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

const BookingSchema = new mongoose.Schema(
  {
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: "flightPrice" },
    providerId: String,

    source: String,
    destination: String,
    travelDate: String,
    passengerCount: Number,

    contact: {
      email: String,
      phone: String,
    },

    passengers: [PassengerSchema],

    priceBreakdown: {
      basePrice: Number,
      taxes: Number,
      discountApplied: Number,
      finalPrice: Number,
      promoCodes: [String],
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
