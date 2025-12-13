// models/payment.js
import mongoose from "mongoose";

const EcommercePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🔹 Gateway
    gateway: { type: String, default: "RAZORPAY" },

    // 🔹 Razorpay IDs
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    // 🔹 Financials
    amount: { type: Number, required: true }, // INR amount
    currency: { type: String, default: "INR" },

    // 🔹 Status lifecycle
    status: {
      type: String,
      enum: [
        "CREATED",
        "AUTHORIZED",
        "PAID",
        "FAILED",
        "REFUND_INITIATED",
        "REFUNDED",
      ],
      default: "CREATED",
    },

    // 🔹 Metadata
    retries: { type: Number, default: 0 },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    // 🔹 Timeline
    paidAt: Date,
    failedAt: Date,
  },
  { collection: "EcommercePayment" }
);

export default mongoose.model("EcommercePayment", EcommercePaymentSchema);
