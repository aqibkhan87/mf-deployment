import express from "express";
const router = express.Router();
import crypto from "crypto";
import FlightPrice from "../../models/flights/flightPrice.js";
import Booking from "../../models/flights/booking.js";
import offersData from "./../offerdata.js";
import { applyPromoToPrice } from "../../services/flights/pricing.js"
import { razorpay } from "../../razorpayService.js";

router.get("/", async (req,res) => {
  const { source, destination, date, providerFlightId, passengerName, email, phone, promo, paymentMethod } = req.body;
  if (!source || !destination || !date || !providerFlightId || !passengerName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // find flight
  const record = await FlightPrice.findOne({ source: source.toUpperCase(), destination: destination.toUpperCase(), date });
  if (!record) return res.status(404).json({ message: "Flight not found" });

  const fare = record.fares.find(f => f.providerFlightId === providerFlightId);
  if (!fare) return res.status(404).json({ message: "Fare not found" });

  const promoObj = promo ? offersData.find(o => o.code === promo.toUpperCase()) : null;
  const { final, discount } = applyPromoToPrice(fare.basePrice, promoObj);

  const booking = new Booking({
    flightRef: record._id,
    providerFlightId,
    passengerName,
    email,
    phone,
    source,
    destination,
    date,
    basePrice: fare.basePrice,
    discountApplied: discount,
    finalPrice: final,
    promoCode: promoObj?.code || null,
    paymentMethod: paymentMethod || "cash"
  });

  await booking.save();
  res.json({ success: true, bookingId: booking._id, finalPrice: final });
});

router.post("/", async (req, res) => {
  const {
    flightId,
    providerId,
    from,
    to,
    departDate,
    passengerCount,
  } = req.body;

  if (!passengerCount)
    return res.status(400).json({ message: "Missing details" });

  const booking = await Booking.create({
    flightId,
    providerId,
    from,
    to,
    departDate,
    passengerCount,
  });

  res.json({
    success: true,
    bookingId: booking._id,
    bookingRef: booking.bookingRef,
  });
});

router.post("/create-payment-order", async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (!booking.paymentRequired)
    return res.json({ skipPayment: true });

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
    await Booking.findByIdAndUpdate(bookingId, {
      bookingStatus: "FAILED",
      "payment.status": "FAILED",
    });
    return res.status(400).json({ success: false });
  }

  await Booking.findByIdAndUpdate(bookingId, {
    bookingStatus: "CONFIRMED",
    "payment.status": "PAID",
    "payment.razorpay_payment_id": razorpay_payment_id,
    "payment.razorpay_signature": razorpay_signature,
    "payment.paidAt": new Date(),
  });

  res.json({ success: true });
});



export default router;
