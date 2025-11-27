import express from "express";
import Booking from "../../models/flights/booking.js";
import FlightPrice from "../../models/flights/flightPrice.js";
import offersData from "./../offerdata.js";
import { applyPromoToPrice } from "../../services/flights/pricing.js"

const router = express.Router();

router.post("/", async (req,res) => {
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

export default router;
