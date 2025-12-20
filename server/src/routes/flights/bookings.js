import express from "express";
const router = express.Router();
import crypto from "crypto";
import FlightPrice from "../../models/flights/flightPrice.js";
import BookingModel from "../../models/flights/booking.js";
import AirportModel from "../../models/flights/airports.js";
import AddonModel from "../../models/flights/addons.js";
import offersData from "./../offerdata.js";
import { applyPromoToPrice } from "../../services/flights/pricing.js";
import { razorpay } from "../../razorpayService.js";
import booking from "../../models/flights/booking.js";

router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const record = await BookingModel.findById(bookingId).populate(
    "passengers.addons"
  );
  if (!record) return res.status(404).json({ message: "Booking not found" });

  let response = {
    flightDetail: record.flightDetail,
    contact: record.contact,
    passengers: record.passengers,
    priceBreakdown: record.priceBreakdown,
    bookingStatus: record.bookingStatus,
    paymentRequired: record.paymentRequired,
    payment: record.payment,
    providerId: record.providerId,
    sourceAirport: record.sourceAirport,
    destinationAirport: record.destinationAirport,
    bookingId: record._id,
  };

  res.json({ success: true, bookingDetails: response });
});

router.post("/", async (req, res) => {
  const {
    flightDetail,
    providerId,
    sourceIATA,
    destinationIATA,
    departDate,
    passengers = [],
    bookingId,
    contact = {},
  } = req.body;

  if (
    !passengers?.length ||
    !flightDetail ||
    !providerId ||
    !sourceIATA ||
    !destinationIATA ||
    !departDate
  )
    return res.status(400).json({ message: "Missing details" });

  let booking = {};

  if (bookingId) {
    booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
  } else {
    const sourceAirport = await AirportModel.findOne({ iata: sourceIATA });
    const destinationAirport = await AirportModel.findOne({
      iata: destinationIATA,
    });

    let priceBreakdown = {
      basePrice: 0,
      taxes: 0,
      addonsPrice: 0,
      finalPrice: 0,
    };

    passengers?.forEach((p) => {
      if (p.type === "adult") {
        priceBreakdown.basePrice += flightDetail?.basePrice || 0;
        priceBreakdown.taxes +=
          flightDetail?.totalPrice - flightDetail?.basePrice;
        priceBreakdown.finalPrice += flightDetail?.totalPrice;
      }
    });

    booking = await BookingModel.create({
      flightDetail,
      providerId,
      sourceIATA,
      destinationIATA,
      departDate,
      passengers,
      contact,
      sourceAirport: sourceAirport,
      destinationAirport: destinationAirport,
      priceBreakdown,
    });
  }

  res.json({
    success: true,
    bookingId: booking._id,
  });
});

router.put("/update-addons-in-passengers", async (req, res) => {
  const { bookingId, passengers = [] } = req.body;

  try {
    // 1️⃣ Basic validation
    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: "Passengers data is required" });
    }

    // 2️⃣ Check booking exists
    let booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let priceBreakdown = booking.priceBreakdown;
    priceBreakdown.addonsPrice = 0;

    const addonIds = passengers.flatMap((p) => p.addons || []);

    const addons = await AddonModel.find({ _id: { $in: addonIds } }).lean();

    const addonPriceMap = new Map(
      addons.map((a) => [a._id.toString(), a.price])
    );

    passengers.forEach((p) => {
      // Calculate addons price
      if (p.addons && p.addons.length > 0) {
        p?.addons?.forEach((addonId) => {
          const addonPrice = addonPriceMap.get(addonId.toString()) || 0;
          priceBreakdown.addonsPrice += addonPrice;
        });
      } else {
        // Remove empty addons array
        p.addons = [];
      }
    });

    priceBreakdown.finalPrice = priceBreakdown.basePrice + priceBreakdown.taxes + priceBreakdown.addonsPrice;

    // 4️⃣ Return updated booking
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      { _id: bookingId },
      { passengers: passengers, priceBreakdown: priceBreakdown },
      { new: true }
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("Update passenger addons error:", error);
    return res.status(500).json({
      message: "Failed to update passenger addons",
      error: error.message,
    });
  }
});

router.post("/create-payment-order", async (req, res) => {
  const { bookingId } = req.body;

  const booking = await BookingModel.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (!booking.paymentRequired) return res.json({ skipPayment: true });

  const order = await razorpay.orders.create({
    amount: Math.round(booking.pricing.finalPrice * 100),
    currency: "INR",
    receipt: booking._id.toString(),
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
