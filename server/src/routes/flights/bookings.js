import express from "express";
const router = express.Router();
import crypto from "crypto";
import FlightPrice from "../../models/flights/flightPrice.js";
import BookingModel from "../../models/flights/booking.js";
import offersData from "./../offerdata.js";
import { applyPromoToPrice } from "../../services/flights/pricing.js";
import { razorpay } from "../../razorpayService.js";

router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const record = await BookingModel.findById(bookingId).populate("flightId");
  if (!record) return res.status(404).json({ message: "Booking not found" });

  
  res.json({ success: true, bookingDetails: record });
});

router.post("/", async (req, res) => {
  const {
    flightId,
    providerId,
    from,
    to,
    departDate,
    passengers = [],
    bookingId,
    contact = {},
  } = req.body;

  if (!passengers?.length)
    return res.status(400).json({ message: "Missing details" });

  let booking = {};

  if (!bookingId) {
    booking = await BookingModel.create({
      flightId,
      providerId,
      from,
      to,
      departDate,
      passengers,
      contact,
    });
  }

  res.json({
    success: true,
    bookingId: booking._id,
    bookingRef: booking.bookingRef,
  });
});

router.post("/create-payment-order", async (req, res) => {
  const { bookingId } = req.body;

  const booking = await BookingModel.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (!booking.paymentRequired) return res.json({ skipPayment: true });

  const order = await razorpay.orders.create({
    amount: Math.round(booking.pricing.finalPrice * 100),
    currency: "INR",
    receipt: booking.bookingRef,
  });

  booking.payment.razorpay_order_id = order.id;
  booking.payment.status = "CREATED";
  await booking.save();

  res.json({ order });
});

router.post("/verify-payment", async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    await BookingModel.findByIdAndUpdate(bookingId, {
      bookingStatus: "FAILED",
      "payment.status": "FAILED",
    });
    return res.status(400).json({ success: false });
  }

  await BookingModel.findByIdAndUpdate(bookingId, {
    bookingStatus: "CONFIRMED",
    "payment.status": "PAID",
    "payment.razorpay_payment_id": razorpay_payment_id,
    "payment.razorpay_signature": razorpay_signature,
    "payment.paidAt": new Date(),
  });

  res.json({ success: true });
});

export default router;
