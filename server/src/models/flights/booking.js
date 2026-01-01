import mongoose from "mongoose";

const PassengerSchema = new mongoose.Schema({
  id: String,
  title: String,
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  infantTagged: Object,
  isAdult: { type: Boolean, default: true },
  isInfant: { type: Boolean, default: false },
  addons: [{ type: mongoose.Schema.Types.ObjectId, ref: "addons" }],
  paidAddons: [{ type: mongoose.Schema.Types.ObjectId, ref: "addons" }],
  seats: {
    type: Map,
    of: new mongoose.Schema(
      {
        seatNumber: String, // "12A"
        cabin: String, // ECONOMY
        price: String,
        seatType: {
          type: String,
          enum: ["window", "aisle", "middle"],
        },
      },
      { _id: false }
    ),
  },
  paidSeats: {
    type: Map,
    of: new mongoose.Schema(
      {
        seatNumber: String, // "12A"
        cabin: String, // ECONOMY
        price: String,
        seatType: {
          type: String,
          enum: ["window", "aisle", "middle"],
        },
      },
      { _id: false }
    ),
  },
  checkinAmount: {
    addonsPrice: { type: Number, default: 0 },
    seatsPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
  },
  status: {
    type: String,
    default: "CREATED",
    enum: ["CREATED", "PAID", "FAILED"],
  }, // CREATED | PAID | FAILED
  razorpay_order_id: String,
  receipt: String,
});

const BookingSchema = new mongoose.Schema(
  {
    flightDetail: Object,
    providerId: String,
    date: String,

    sourceIATA: String,
    destinationIATA: String,
    sourceAirport: Object,
    destinationAirport: Object,
    connectingAirports: [
      {
        name: String,
        city: String,
        country: String,
        iata: String,
        icao: String,
      },
    ],
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
      totalPrice: { type: Number, default: 0 },
      seatsPrice: { type: Number, default: 0 },
    },

    paymentRequired: { type: Boolean, default: true },

    bookingStatus: {
      type: String,
      enum: [
        "IN_PROGRESS",
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CANCELLED",
        "FAILED",
        "COMPLETED",
      ],
      default: "IN_PROGRESS",
    },
  },
  { timestamps: true, collection: "booking" }
);

const BookingModel = mongoose.model("booking", BookingSchema);

export default BookingModel;
