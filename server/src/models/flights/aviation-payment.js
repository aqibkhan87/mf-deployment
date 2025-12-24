import mongoose from "mongoose";

const AviationPaymentSchema = new mongoose.Schema(
  {
    gateway: { type: String, default: "RAZORPAY" },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    receipt: String,
    PNR: String,

    amount: { type: Number, required: true }, 
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: [
        "IN_PROGRESS",
        "AUTHORIZED",
        "PAID",
        "FAILED",
        "REFUND_INITIATED",
        "REFUNDED",
      ],
      default: "IN_PROGRESS",
    },

    retries: { type: Number, default: 0 },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
    },
    paidAt: Date,
    failedAt: Date,
  },
  { collection: "AviationPayment" }
);

export default mongoose.model("AviationPayment", AviationPaymentSchema);
