// services/amadeusService.js
import dotenv from "dotenv";
dotenv.config();
import Amadeus from "amadeus";
import FlightPrice from "./../models/flights/flightPrice.js";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

export const ROUTES = [
  // 🇮🇳 India Domestic
  ["DEL", "BOM"], ["DEL", "BLR"], ["DEL", "HYD"], ["BOM", "BLR"], ["BLR", "MAA"],
  ["DEL", "CCU"], ["DEL", "PNQ"], ["BOM", "DEL"], ["BLR", "DEL"], ["HYD", "BOM"],

  // 🌍 India International
  ["DEL", "DXB"], ["DEL", "SIN"], ["DEL", "DOH"], ["BOM", "DXB"], ["BLR", "KUL"],

  // 🇺🇸 US Domestic
  ["JFK", "LAX"], ["LAX", "ORD"], ["SFO", "SEA"], ["ATL", "DFW"], ["MIA", "ORD"],
  ["ORD", "LAX"], ["BOS", "JFK"], ["SEA", "DEN"], ["LAS", "PHX"], ["LAX", "SFO"],

  // 🌐 US International
  ["JFK", "LHR"], ["JFK", "CDG"], ["LAX", "NRT"], ["SFO", "HND"], ["ORD", "FRA"],

  // 🇬🇧 & 🇪🇺 Europe
  ["LHR", "CDG"], ["LHR", "AMS"], ["CDG", "FRA"], ["FRA", "MAD"], ["MAD", "BCN"],
  ["FRA", "ZRH"], ["CDG", "MXP"], ["AMS", "CPH"], ["FCO", "ATH"], ["LHR", "DUB"],

  // 🇸🇬 Asia-Pacific
  ["SIN", "SYD"], ["SIN", "BKK"], ["BKK", "HKG"], ["HKG", "ICN"], ["ICN", "NRT"],
  ["SIN", "KUL"], ["KUL", "CGK"], ["CGK", "DPS"], ["SYD", "MEL"], ["BNE", "AKL"],

  // 🌍 Middle East
  ["DXB", "JED"], ["DXB", "RUH"], ["DOH", "DXB"], ["DXB", "BOM"], ["DXB", "DEL"],
];

// Delay utility to avoid hitting API rate limit
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Save Amadeus data in MongoDB
async function saveAmadeusData(origin, destination, date, amadeusData) {
  const fares = amadeusData.map((offer) => {
    const firstItinerary = offer.itineraries[0];
    const traveler = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0];

    return {
      providerOfferId: offer.id,
      validatingAirline: offer.validatingAirlineCodes?.[0],
      totalPrice: Number(offer.price.total),
      basePrice: Number(offer.price.base),
      currency: offer.price.currency,
      duration: firstItinerary.duration,
      segments: firstItinerary.segments.map((seg) => ({
        carrierCode: seg.carrierCode,
        flightNumber: seg.number,
        aircraftCode: seg.aircraft?.code,
        departureAirport: seg.departure.iataCode,
        arrivalAirport: seg.arrival.iataCode,
        departureTime: new Date(seg.departure.at),
        arrivalTime: new Date(seg.arrival.at),
        duration: seg.duration,
        cabin: traveler?.cabin,
        class: traveler?.class,
      })),
    };
  });

  await FlightPrice.updateOne(
    { origin, destination, date },
    { origin, destination, date, fares },
    { upsert: true }
  );

  console.log(`✅ Saved ${origin}-${destination} (${date.toISOString().split("T")[0]})`);
}

// Fetch flights for one date
async function fetchFlightsForDate(date) {
  const dateStr = date.toISOString().split("T")[0];

  for (const [origin, destination] of ROUTES) {
    console.log("origin, destination", origin, destination)
    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: dateStr,
        adults: 1,
        currencyCode: "INR",
        max: 3, // top 3 offers per route
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

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getISTTodayUTC() {
  const nowUTC = new Date();
  const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

  nowIST.setHours(0, 0, 0, 0); // start of IST day

  return new Date(nowIST.getTime());
}

// Main: fetch today and tomorrow
async function fetchTodayFlights() {
  const todayUTC = getISTTodayUTC()

  console.log("🔍 Fetching today's flights...", todayUTC);
  await fetchFlightsForDate(todayUTC);

  console.log("✅ All routes processed now at:->", todayUTC);
}

export default fetchTodayFlights;