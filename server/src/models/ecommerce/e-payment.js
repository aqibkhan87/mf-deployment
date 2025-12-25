import mongoose from "mongoose";

const EcommercePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    gateway: { type: String, default: "RAZORPAY" },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    receipt: String,

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
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    paidAt: Date,
    failedAt: Date,
  },
  { collection: "EcommercePayment" }
);

const EcommercePaymentModel = mongoose.model("EcommercePayment", EcommercePaymentSchema);

export default EcommercePaymentModel;
