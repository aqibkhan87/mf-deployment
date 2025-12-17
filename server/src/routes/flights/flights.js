import express from "express";
import FlightPrice from "../../models/flights/flightPrice.js";
import { applyPromoToPrice } from "../../services/flights/pricing.js";
import offersData from "./../offerdata.js"; // small helper, or call /api/offers
import AirlinesMapping from "./airlinesMapping.js";
const apiRouter = express.Router();

/**
 * GET /api/flights/search?from=DEL&to=BOM&date=2025-10-08&promo=HDFCFLY
 * Reads from FlightPrice collection (populated by daily cron job).
 */
apiRouter.get("/", async (req, res) => {
  try {
    const { from, to, date, promo, providerId, flightId } = req.query;

    if (providerId && flightId) {
      const record = await FlightPrice.findOne({
        _id: flightId,
        "fares.providerOfferId": providerId,
      });

      if (!record) {
        return res.status(404).json({ message: "Flight not found" });
      }

      const fare = record.fares.find(
        (f) => f.providerOfferId === providerId
      );

      if (!fare) {
        return res.status(404).json({ message: "Fare not found" });
      }

      const airline = AirlinesMapping[fare.validatingAirline] || {
        name: fare.validatingAirline,
        code: fare.validatingAirline,
        logo: "https://via.placeholder.com/48?text=?",
      };

      return res.json({
        flights: {
          _id: record._id,
          origin: record.origin,
          destination: record.destination,
          date: record.date,
          fare: {
            providerOfferId: fare.providerOfferId,
            airline: {
              name: airline.name,
              code: airline.code,
              logo: airline.logo,
            },
            totalPrice: fare.totalPrice,
            basePrice: fare.basePrice,
            currency: fare.currency,
            duration: fare.duration,
            segments: fare.segments,
          },
        },
      });
    }

    // ==================================
    // 2️⃣ CASE: Normal search (fallback)
    // ==================================
    if (!from || !to || !date) {
      return res.status(400).json({ message: "Missing from/to/date" });
    }

    const redis = req.app.get("redis");
    const cacheKey = `search:${from}-${to}:${date}:${promo || ""}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const record = await FlightPrice.findOne({
      origin: from.toUpperCase(),
      destination: to.toUpperCase(),
      date: { $gte: startDate, $lte: endDate },
    });

    if (!record) return res.json({ flights: [] });

    const fares = record.fares.map((f) => {
      const airline = AirlinesMapping[f.validatingAirline] || {
        name: f.validatingAirline,
        code: f.validatingAirline,
        logo: "https://via.placeholder.com/48?text=?",
      };

      return {
        providerOfferId: f.providerOfferId,
        airline: {
          name: airline.name,
          code: airline.code,
          logo: airline.logo,
        },
        totalPrice: f.totalPrice,
        basePrice: f.basePrice,
        currency: f.currency,
        duration: f.duration,
        segments: f.segments,
      };
    });

    const payload = {
      flights: {
        ...record.toObject(),
        fares,
      },
    };

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(payload), "EX", 60 * 60);
    }

    return res.json(payload);

  } catch (err) {
    console.error("Flight search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
