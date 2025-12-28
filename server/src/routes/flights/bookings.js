import express from "express";
const router = express.Router();
import crypto from "crypto";
import BookingModel from "../../models/flights/booking.js";
import AirportModel from "../../models/flights/airports.js";
import AddonModel from "../../models/flights/addons.js";
import SeatMapModel from "../../models/flights/seatMap.js";
import { razorpay } from "../../razorpayService.js";

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
    date: record.date,
    priceBreakdown: record.priceBreakdown,
    bookingStatus: record.bookingStatus,
    paymentRequired: record.paymentRequired,
    payment: record.payment,
    providerId: record.providerId,
    sourceAirport: record.sourceAirport,
    destinationAirport: record.destinationAirport,
    bookingId: record._id,
    connectingAirports: record?.connectingAirports,
  };

  res.json({ success: true, bookingDetails: response });
});

router.post("/", async (req, res) => {
  const {
    flightDetail,
    providerId,
    sourceIATA,
    destinationIATA,
    date,
    passengers = [],
    bookingId,
    contact = {},
    connectingAirports = [],
  } = req.body;

  if (
    !passengers?.length ||
    !flightDetail ||
    !providerId ||
    !sourceIATA ||
    !destinationIATA ||
    !date
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
      totalPrice: 0,
    };

    passengers?.forEach((p) => {
      if (p.type === "adult") {
        priceBreakdown.basePrice += Number(flightDetail?.basePrice) || 0;
        priceBreakdown.taxes += Math.round(
          flightDetail?.totalPrice - flightDetail?.basePrice
        );
        priceBreakdown.totalPrice += Number(flightDetail?.totalPrice);
      }
    });

    booking = await BookingModel.create({
      flightDetail,
      providerId,
      sourceIATA,
      destinationIATA,
      date,
      passengers,
      contact,
      sourceAirport: sourceAirport,
      destinationAirport: destinationAirport,
      priceBreakdown,
      connectingAirports,
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

    priceBreakdown.totalPrice =
      priceBreakdown.basePrice +
      priceBreakdown.taxes +
      priceBreakdown.addonsPrice;

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

router.put("/update-seats-in-booking", async (req, res) => {
  const { bookingId, passengers = [], itineraryKey } = req.body;

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

    const seatMap = await SeatMapModel.findOne({
      itineraryKey: itineraryKey,
    });

    if (!seatMap) {
      return res.status(404).json({ message: "Seat map not found" });
    }

    let priceBreakdown = booking.priceBreakdown;
    priceBreakdown.seatsPrice = 0;

    passengers.forEach((p) => {
      for (let [key, value] of Object.entries(p?.seats)) {
        if (p?.seats?.[key]) {
          // Calculate seat price
          const seatPrice = value?.price || 0;
          priceBreakdown.seatsPrice += Number(seatPrice);
        }
      }
    });

    const totalPrice =
      priceBreakdown.basePrice +
      priceBreakdown.taxes +
      priceBreakdown.addonsPrice +
      priceBreakdown.seatsPrice;
    priceBreakdown.totalPrice = Math.round(totalPrice);

    // 4️⃣ Return updated booking
    await BookingModel.findByIdAndUpdate(
      { _id: bookingId },
      { passengers: passengers, priceBreakdown: priceBreakdown },
      { new: true }
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("Update passenger Seat error:", error);
    return res.status(500).json({
      message: "Failed to update seat price",
      error: error.message,
    });
  }
});

export default router;
