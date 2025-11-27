import express from "express";
import FlightPrice from "../../models/flights/flightPrice.js";
import { applyPromoToPrice } from "../../services/flights/pricing.js";
import offersData from "./../offerdata.js"; // small helper, or call /api/offers

const router = express.Router();

/**
 * GET /api/flights/search?from=DEL&to=BOM&date=2025-10-08&promo=HDFCFLY
 * Reads from FlightPrice collection (populated by daily cron job).
 */
router.get("/", async (req, res) => {
  const { from, to, date, promo } = req.query;

  if (!from || !to || !date)
    return res.status(400).json({ message: "Missing from/to/date" });

  // First try Redis cache if present
  const redis = req.app.get("redis");
  
  const cacheKey = `search:${from}-${to}:${date}:${promo || ""}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  }

  const [year, month, day] = date.split("-");
  const startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  const endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
  console.log("req.query;req.query;redis", req.query, "redis", redis, day, month, year);
  const record = await FlightPrice.findOne({
    origin: from.toUpperCase(),
    destination: to.toUpperCase(),
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  console.log("recordrecord", record);
  if (!record) return res.json({ flights: [] });

  // const promoObj = promo
  //   ? offersData.find((o) => o.code.toUpperCase() === promo.toUpperCase())
  //   : null;
  // const flights = record.fares.map((f) => {
  //   const { final, discount } = applyPromoToPrice(f.basePrice, promoObj);
  //   return {
  //     providerFlightId: f.providerFlightId,
  //     airline: f.airline,
  //     depart: f.departureTime,
  //     arrive: f.arrivalTime,
  //     duration: f.duration,
  //     basePrice: f.basePrice,
  //     finalPrice: final,
  //     discount,
  //     cabin: f.cabin,
  //     availableSeats: f.availableSeats,
  //   };
  // });

  const payload = { flights: record };
  if (redis) await redis.set(cacheKey, JSON.stringify(payload), "EX", 60 * 60); // cache 1h

  res.json(payload);
});

export default router;
