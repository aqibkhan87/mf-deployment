// services/amadeusService.js
import dotenv from "dotenv";
dotenv.config();
import Amadeus from "amadeus";
import FlightPrice from "./../models/flights/flightPrice.js";
import { createSeatMapsForFlight } from "../utils/flightSeatMap/importSeatMap.js";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

export const ROUTES = [
  // 🇮🇳 India Domestic
  ["DEL", "BOM"],
  ["DEL", "BLR"],
  ["DEL", "HYD"],
  ["BOM", "BLR"],
  ["BLR", "MAA"],
  ["DEL", "CCU"],
  ["DEL", "PNQ"],
  ["BOM", "DEL"],
  ["BLR", "DEL"],
  ["HYD", "BOM"],

  // 🌍 India International
  ["DEL", "DXB"],
  ["DEL", "SIN"],
  ["DEL", "DOH"],
  ["BOM", "DXB"],
  ["BLR", "KUL"],

  // 🇺🇸 US Domestic
  ["JFK", "LAX"],
  ["LAX", "ORD"],
  ["SFO", "SEA"],
  ["ATL", "DFW"],
  ["MIA", "ORD"],
  ["ORD", "LAX"],
  ["BOS", "JFK"],
  ["SEA", "DEN"],
  ["LAS", "PHX"],
  ["LAX", "SFO"],

  // 🌐 US International
  ["JFK", "LHR"],
  ["JFK", "CDG"],
  ["LAX", "NRT"],
  ["SFO", "HND"],
  ["ORD", "FRA"],

  // 🇬🇧 & 🇪🇺 Europe
  ["LHR", "CDG"],
  ["LHR", "AMS"],
  ["CDG", "FRA"],
  ["FRA", "MAD"],
  ["MAD", "BCN"],
  ["FRA", "ZRH"],
  ["CDG", "MXP"],
  ["AMS", "CPH"],
  ["FCO", "ATH"],
  ["LHR", "DUB"],

  // 🇸🇬 Asia-Pacific
  ["SIN", "SYD"],
  ["SIN", "BKK"],
  ["BKK", "HKG"],
  ["HKG", "ICN"],
  ["ICN", "NRT"],
  ["SIN", "KUL"],
  ["KUL", "CGK"],
  ["CGK", "DPS"],
  ["SYD", "MEL"],
  ["BNE", "AKL"],

  // 🌍 Middle East
  ["DXB", "JED"],
  ["DXB", "RUH"],
  ["DOH", "DXB"],
  ["DXB", "BOM"],
  ["DXB", "DEL"],
];

// Delay utility to avoid hitting API rate limit
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const applyPriceDecrease = (price, dayOffset) => {
  const factor = Math.pow(0.99, dayOffset); // 1% per day
  return Number((price * factor).toFixed(2));
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Save Amadeus data in MongoDB
async function saveAmadeusData(origin, destination, baseDate, amadeusData) {
  for (let day = 0; day <= 10; day++) {
    const date = addDays(baseDate, day);
    const fares = amadeusData?.map((offer) => {
      const firstItinerary = offer.itineraries[0];
      const traveler = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0];

      return {
        providerOfferId: offer.id,
        validatingAirline: offer.validatingAirlineCodes?.[0],
        totalPrice: applyPriceDecrease(offer.price.total, day),
        basePrice: applyPriceDecrease(offer.price.base, day),
        currency: offer.price.currency,
        duration: firstItinerary.duration,
        segments: firstItinerary.segments.map((seg) => {
          const departureDate = new Date(seg.departure.at);
          const nextDayDeparture = new Date(departureDate); // create a copy
          nextDayDeparture.setDate(departureDate.getDate() + day);

          const arrivalDate = new Date(seg.arrival.at);
          const nextDayArrival = new Date(arrivalDate); // create a copy
          nextDayArrival.setDate(arrivalDate.getDate() + day);

          return {
            carrierCode: seg.carrierCode,
            flightNumber: seg.number,
            aircraftCode: seg.aircraft?.code,
            departureAirport: seg.departure.iataCode,
            arrivalAirport: seg.arrival.iataCode,
            departureTime: nextDayDeparture,
            arrivalTime: nextDayArrival,
            duration: seg.duration,
            cabin: traveler?.cabin,
            class: traveler?.class,
          };
        }),
      };
    });

    await createSeatMapsForFlight(fares);

    await FlightPrice.updateOne(
      {
        origin,
        destination,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lte: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      {
        origin,
        destination,
        date,
        fares: fares,
      },
      { upsert: true }
    );
  }

  console.log(
    `✅ Saved ${origin}-${destination} (${
      baseDate.toISOString().split("T")[0]
    })`
  );
}

// Fetch flights for one date
async function fetchFlightsForDate(date) {
  const dateStr = date.toISOString().split("T")[0];

  for (const [origin, destination] of ROUTES) {
    console.log("origin, destination", origin, destination, dateStr);
    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: dateStr,
        adults: 1,
        currencyCode: "INR",
        max: 10, // top 10 offers per route
      });

      if (response?.data?.length) {
        await saveAmadeusData(origin, destination, date, response.data);
      } else {
        console.log(`⚠️ No data for ${origin}-${destination}`);
      }

      await delay(2000); // 2s delay to avoid rate limits
    } catch (err) {
      console.error(`❌ Error fetching ${origin}-${destination}:`, err.message);
    }
  }
}

// Main: fetch today and tomorrow
async function fetchTodayFlights() {
  const date = new Date();

  console.log("🔍 Fetching today's flights...", date);
  await fetchFlightsForDate(date);

  console.log("✅ All routes processed now at:->", date);
}

export default fetchTodayFlights;
