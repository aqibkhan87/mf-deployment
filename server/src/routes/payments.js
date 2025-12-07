// routes/payments.js
import express from "express";
import crypto from "crypto";
import { razorpay } from "../razorpayService.js";
import Cart from "../models/ecommerce/e-cart.js";
import Booking from "../models/flights/booking.js";

const router = express.Router();

/* ============================
   CREATE RAZORPAY ORDER
============================= */
router.post("/create-order", async (req, res) => {
  try {
    const { type, entityId } = req.body;
    if (!type || !entityId)
      return res.status(400).json({ message: "type and entityId required" });

    let amount = 0;
    let receipt = "";

    if (type === "ECOMMERCE") {
      const cart = await Cart.findById(entityId);
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      amount = Math.round(cart.summary.total * 100);
      receipt = `CART_${cart._id}`;
      await Cart.findByIdAndUpdate(cart._id, {
        payment: { status: "CREATED" },
      });
    }

    if (type === "FLIGHT") {
      const booking = await Booking.findById(entityId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });

      amount = Math.round(booking.pricing.finalPrice * 100);
      receipt = `BOOK_${booking.bookingRef}`;
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   VERIFY PAYMENT
============================= */
router.post("/verify", async (req, res) => {
  try {
    const {
      type,
      entityId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      await markFailed(type, entityId);
      return res.status(400).json({ success: false });
    }

    await markSuccess(type, entityId, {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   HELPERS
============================= */
async function markSuccess(type, id, payment) {
  if (type === "ECOMMERCE") {
    await Cart.findByIdAndUpdate(id, {
      "payment.status": "PAID",
      "payment.razorpay_payment_id": payment.razorpay_payment_id,
      "payment.paidAt": new Date(),
    });
    // ✅ convert cart → order
  }

  if (type === "FLIGHT") {
    await Booking.findByIdAndUpdate(id, {
      bookingStatus: "CONFIRMED",
      "payment.status": "PAID",
      "payment.razorpay_payment_id": payment.razorpay_payment_id,
      "payment.paidAt": new Date(),
    });
  }
}

async function markFailed(type, id) {
  if (type === "ECOMMERCE") {
    await Cart.findByIdAndUpdate(id, { "payment.status": "FAILED" });
  }
  if (type === "FLIGHT") {
    await Booking.findByIdAndUpdate(id, {
      bookingStatus: "FAILED",
      "payment.status": "FAILED",
    });
  }
}

export default router;
