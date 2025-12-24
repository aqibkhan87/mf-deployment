// routes/payments.js
import express from "express";
import crypto from "crypto";
import { razorpay } from "../razorpayService.js";
import CartModel from "../models/ecommerce/e-cart.js";
import BookingModel from "../models/flights/booking.js";
import EcommercePayment from "../models/ecommerce/e-payment.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { entityId, type } = req.body;
    let cart;
    let booking;
    if (type === "ECOMMERCE") {
      cart = await CartModel.findOne({ _id: entityId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
    } else if (type === "FLIGHT") {
      booking = await BookingModel.findOne({ _id: entityId });
      if (!booking) return res.status(404).json({ message: "Booking not found" });
    }

    let order;
    let payment;

    if(cart) {
      const amount = cart?.totalAmount || 0;
  
      // ✅ ZERO AMOUNT ORDER
      if (amount <= 0) {
        const payment = await EcommercePayment.create({
          userId: cart?.userId,
          amount: 0,
          status: "PAID",
          paidAt: new Date(),
          notes: { freeOrder: true },
        });
  
        cart.paymentId = payment._id;
        await cart.save();
  
        return res.json({ skipPayment: true, success: true });
      }

      // ✅ Create payment record
      payment = await EcommercePayment.create({
        userId: cart.userId,
        amount,
        currency: "INR",
        status: "CREATED",
        notes: { cartId: cart._id },
      });
  
      // ✅ Create Razorpay order
      order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: cart ? `Ecommerce_${cart?._id}` : `Avition_${booking?._id}`,
      });
  
      payment.razorpay_order_id = order.id;
      await payment.save();
  
      cart.paymentId = payment._id;
      await cart.save();
    }


    res.json({
      orderId: order?.id,
      amount: order?.amount,
      currency: order?.currency,
      paymentId: payment?._id,
    });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   VERIFY PAYMENT
============================= */
router.post("/verify-payment", async (req, res) => {
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
    await CartModel.findByIdAndUpdate(id, {
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
    await CartModel.findByIdAndUpdate(id, { "payment.status": "FAILED" });
  }
  if (type === "FLIGHT") {
    await BookingModel.findByIdAndUpdate(id, {
      bookingStatus: "FAILED",
      "payment.status": "FAILED",
    });
  }
}

export default router;
