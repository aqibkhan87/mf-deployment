import express from "express";
import FlightPrice from "../../models/flights/flightPrice.js";
import Airports from "../../models/flights/airports.js";
import { parseDurationToMinutes } from "../../services/flights/pricing.js";
import AirlinesMapping from "./airlinesMapping.js";
const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  try {
    const { from, to, date, promo, providerId, flightId } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ message: "Missing from/to/date" });
    }

    const sourceAirport = await Airports.findOne({ iata: from });
    const destinationAirport = await Airports.findOne({ iata: to });

    if (providerId && flightId) {
      const record = await FlightPrice.findOne({
        _id: flightId,
        "fares.providerOfferId": providerId,
      }).lean();

      if (!record) {
        return res.status(404).json({
          flights: [],
          sourceAirport: sourceAirport || null,
          destinationAirport: destinationAirport || null,
        });
      }

      const fare = record.fares.find((f) => f.providerOfferId === providerId);

      if (!fare) {
        return res.status(404).json({ message: "Fare not found" });
      }

      const airline = AirlinesMapping[fare.validatingAirline] || {
        name: fare.validatingAirline,
        code: fare.validatingAirline,
        logo: "https://via.placeholder.com/48?text=?",
      };

      

      const segmentCodes = new Set();
      fare.segments.forEach((seg) => {
        if (seg.arrivalAirport) segmentCodes.add(seg.arrivalAirport);
        if (seg.departureAirport) segmentCodes.add(seg.departureAirport);
      });
      const travelerPricings = fare?.travelerPricings?.flatMap((travelerPrice) => {
        return travelerPrice?.fareDetailsBySegment?.map(
          (fareDetailsBySegment) => {
            return {
              includedCheckedBags: fareDetailsBySegment?.includedCheckedBags,
              includedCabinBags: fareDetailsBySegment?.includedCabinBags,
              cabin: fareDetailsBySegment?.cabin,
            };
          }
        );
      });

      // Fetch all connecting airports from DB
      const connectingAirports = await Airports.find({
        iata: { $in: Array.from(segmentCodes) },
      });

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
            duration: parseDurationToMinutes(fare.duration),
            segments: fare.segments,
            travelerPricing: travelerPricings,
          },
          connectingAirports: connectingAirports || [],
        },
        sourceAirport: sourceAirport || null,
        destinationAirport: destinationAirport || null,
      });
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

    if (!record)
      return res.json({
        flights: [],
        sourceAirport: sourceAirport || null,
        destinationAirport: destinationAirport || null,
      });

    const fares = record.fares.map((f) => {
      const airline = AirlinesMapping[f.validatingAirline] || {
        name: f.validatingAirline,
        code: f.validatingAirline,
        logo: "https://via.placeholder.com/48?text=?",
      };
      const travelerPricings = f?.travelerPricings?.flatMap((travelerPrice) => {
        return travelerPrice?.fareDetailsBySegment?.map(
          (fareDetailsBySegment) => {
            return {
              includedCheckedBags: fareDetailsBySegment?.includedCheckedBags,
              includedCabinBags: fareDetailsBySegment?.includedCabinBags,
              cabin: fareDetailsBySegment?.cabin,
            };
          }
        );
      });

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
        travelerPricings: travelerPricings,
      };
    });

    // Collect all unique connecting airports from all fares
    const allSegmentCodes = new Set();
    record.fares.forEach((fare) => {
      fare.segments.forEach((seg) => {
        if (seg.arrivalAirport) allSegmentCodes.add(seg.arrivalAirport);
        if (seg.departureAirport) allSegmentCodes.add(seg.departureAirport);
      });
    });

    const connectingAirports = await Airports.find({
      iata: { $in: Array.from(allSegmentCodes) },
    });

    const payload = {
      flights: {
        ...record.toObject(),
        fares,
        connectingAirports: connectingAirports || [],
      },
      sourceAirport: sourceAirport || null,
      destinationAirport: destinationAirport || null,
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

apiRouter.get("/list", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startDate = new Date(`${today}T00:00:00.000Z`);
    const endDate = new Date(`${today}T23:59:59.999Z`);

    // 1️⃣ Fetch all flights for today
    const records = await FlightPrice.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    if (!records || records.length === 0) {
      return res.json({ flights: [], connectingAirports: [] });
    }

    const uniqueAirportCodes = new Set();

    // 2️⃣ Build flights array with ONLY first fare
    const flights = records.map((flight) => {
      const firstFare = flight.fares?.[0];
      if (flight.origin) uniqueAirportCodes.add(flight.origin);
      if (flight.destination) uniqueAirportCodes.add(flight.destination);

      // Collect airports from first fare only
      firstFare?.segments?.forEach((seg) => {
        if (seg.departureAirport) uniqueAirportCodes.add(seg.departureAirport);
        if (seg.arrivalAirport) uniqueAirportCodes.add(seg.arrivalAirport);
      });

      return {
        _id: flight._id,
        origin: flight.origin,
        destination: flight.destination,
        date: flight.date,
        fare: firstFare,
      };
    });

    // 3️⃣ Fetch unique connecting airports
    const connectingAirports = await Airports.find({
      iata: { $in: [...uniqueAirportCodes] },
    }).lean();

    return res.json({
      flights,
      connectingAirports,
    });
  } catch (err) {
    console.error("Flight list error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
