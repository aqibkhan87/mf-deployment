import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

import typeDefs from "./src/grapghql/schemas/index.js";
import resolvers from "./src/grapghql/resolvers/index.js";
import connectDB from "./db.js";
import apiRouter from "./src/apiRouter.js";
import "./src/cron/updateFlightData.js";
import { createSeatMapsForFlight } from "./src/utils/flightSeatMap/importSeatMap.js";

const redis = new Redis({ host: "localhost", port: 6379 });
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

// All your MF domains:
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8083",
  "https://www.metacook.in",
];

// CORS config for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    console.log("Frontend Origin:", origin);
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔥 context must be defined HERE, not inside ApolloServer()
app.use(
  "/graphql",
  cors(corsOptions),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const { authorization } = req.headers;
      const token = authorization?.split(" ")[1];
      if (token?.trim() !== "" && token !== undefined && token !== null) {
        try {
          const userId = jwt.verify(authorization, process.env.JWT_SECRET);
          return { redis, userId };
        } catch (err) {
          console.error("JWT error:", err.message);
          return { redis };
        }
      }
      return { redis };
    },
  })
);

app.use(cors(corsOptions), express.json());

// Preflight for all routes
app.options(/.*/, cors(corsOptions));

app.use("/api", apiRouter);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log("🚀 Server ready at http://localhost:4000");
connectDB();
let flights = [
  {
    providerOfferId: "1",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 8649.63,
    basePrice: 7619.04,
    currency: "INR",
    duration: "PT2H15M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2999",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T16:30:00.000Z",
        arrivalTime: "2025-12-20T18:45:00.000Z",
        duration: "PT2H15M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
  {
    providerOfferId: "2",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 8649.63,
    basePrice: 7619.04,
    currency: "INR",
    duration: "PT2H25M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2433",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T16:00:00.000Z",
        arrivalTime: "2025-12-20T18:25:00.000Z",
        duration: "PT2H25M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
  {
    providerOfferId: "3",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 8649.63,
    basePrice: 7619.04,
    currency: "INR",
    duration: "PT2H25M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2437",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T17:00:00.000Z",
        arrivalTime: "2025-12-20T19:25:00.000Z",
        duration: "PT2H25M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
  {
    providerOfferId: "4",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 9443.61,
    basePrice: 8375.4,
    currency: "INR",
    duration: "PT2H25M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2439",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T17:30:00.000Z",
        arrivalTime: "2025-12-20T19:55:00.000Z",
        duration: "PT2H25M",
        cabin: "ECONOMY",
        class: "Q",
      },
    ],
  },
  {
    providerOfferId: "5",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 11275.11,
    basePrice: 9951.48,
    currency: "INR",
    duration: "PT8H35M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2929",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "AMD",
        departureTime: "2025-12-20T16:15:00.000Z",
        arrivalTime: "2025-12-20T17:55:00.000Z",
        duration: "PT1H40M",
        cabin: "ECONOMY",
        class: "W",
      },
      {
        carrierCode: "AI",
        flightNumber: "2918",
        aircraftCode: "32N",
        departureAirport: "AMD",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T23:20:00.000Z",
        arrivalTime: "2025-12-21T00:50:00.000Z",
        duration: "PT1H30M",
        cabin: "ECONOMY",
        class: "W",
      },
    ],
  },
  {
    providerOfferId: "6",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 11275.11,
    basePrice: 9951.48,
    currency: "INR",
    duration: "PT11H55M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2929",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "AMD",
        departureTime: "2025-12-20T16:15:00.000Z",
        arrivalTime: "2025-12-20T17:55:00.000Z",
        duration: "PT1H40M",
        cabin: "ECONOMY",
        class: "W",
      },
      {
        carrierCode: "AI",
        flightNumber: "614",
        aircraftCode: "321",
        departureAirport: "AMD",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T02:25:00.000Z",
        arrivalTime: "2025-12-20T04:10:00.000Z",
        duration: "PT1H45M",
        cabin: "ECONOMY",
        class: "W",
      },
    ],
  },
  {
    providerOfferId: "7",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 13950.09,
    basePrice: 12498.75,
    currency: "INR",
    duration: "PT14H",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "479",
        aircraftCode: "321",
        departureAirport: "DEL",
        arrivalAirport: "ATQ",
        departureTime: "2025-12-20T15:50:00.000Z",
        arrivalTime: "2025-12-20T17:05:00.000Z",
        duration: "PT1H15M",
        cabin: "ECONOMY",
        class: "V",
      },
      {
        carrierCode: "AI",
        flightNumber: "2729",
        aircraftCode: "32N",
        departureAirport: "ATQ",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T03:05:00.000Z",
        arrivalTime: "2025-12-20T05:50:00.000Z",
        duration: "PT2H45M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
  {
    providerOfferId: "8",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 14355.99,
    basePrice: 12885.84,
    currency: "INR",
    duration: "PT10H",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2449",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "HYD",
        departureTime: "2025-12-19T16:20:00.000Z",
        arrivalTime: "2025-12-19T18:40:00.000Z",
        duration: "PT2H20M",
        cabin: "ECONOMY",
        class: "V",
      },
      {
        carrierCode: "AI",
        flightNumber: "2872",
        aircraftCode: "32N",
        departureAirport: "HYD",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T00:45:00.000Z",
        arrivalTime: "2025-12-20T02:20:00.000Z",
        duration: "PT1H35M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
  {
    providerOfferId: "9",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 14355.99,
    basePrice: 12885.84,
    currency: "INR",
    duration: "PT12H25M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2449",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "HYD",
        departureTime: "2025-12-20T16:20:00.000Z",
        arrivalTime: "2025-12-20T18:40:00.000Z",
        duration: "PT2H20M",
        cabin: "ECONOMY",
        class: "V",
      },
      {
        carrierCode: "AI",
        flightNumber: "2626",
        aircraftCode: "32N",
        departureAirport: "HYD",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T02:50:00.000Z",
        arrivalTime: "2025-12-20T04:45:00.000Z",
        duration: "PT1H55M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
  {
    providerOfferId: "10",
    airline: {
      name: "Air India",
      code: "AI",
      logo: "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png",
    },
    totalPrice: 17203.23,
    basePrice: 15597.45,
    currency: "INR",
    duration: "PT11H10M",
    segments: [
      {
        carrierCode: "AI",
        flightNumber: "2412",
        aircraftCode: "32N",
        departureAirport: "DEL",
        arrivalAirport: "BLR",
        departureTime: "2025-12-20T16:05:00.000Z",
        arrivalTime: "2025-12-20T19:00:00.000Z",
        duration: "PT2H55M",
        cabin: "ECONOMY",
        class: "V",
      },
      {
        carrierCode: "AI",
        flightNumber: "2402",
        aircraftCode: "32N",
        departureAirport: "BLR",
        arrivalAirport: "BOM",
        departureTime: "2025-12-20T01:10:00.000Z",
        arrivalTime: "2025-12-20T03:15:00.000Z",
        duration: "PT2H5M",
        cabin: "ECONOMY",
        class: "V",
      },
    ],
  },
];
// await createSeatMapsForFlight(flights);
