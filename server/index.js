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
let flights = 
  [
    {
        "providerOfferId": "1",
        "airline": {
            "name": "Air India",
            "code": "AI",
            "logo": "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png"
        },
        "totalPrice": 8563.13,
        "basePrice": 7542.85,
        "currency": "INR",
        "duration": "PT2H15M",
        "segments": [
            {
                "carrierCode": "AI",
                "flightNumber": "2999",
                "aircraftCode": "32N",
                "departureAirport": "DEL",
                "arrivalAirport": "BOM",
                "departureTime": "2025-12-21T16:30:00.000Z",
                "arrivalTime": "2025-12-21T18:45:00.000Z",
                "duration": "PT2H15M",
                "cabin": "ECONOMY",
                "class": "V"
            }
        ]
    },
    {
        "providerOfferId": "2",
        "airline": {
            "name": "Air India",
            "code": "AI",
            "logo": "https://content.airhex.com/content/logos/airlines_AI_200_200_r.png"
        },
        "totalPrice": 8563.13,
        "basePrice": 7542.85,
        "currency": "INR",
        "duration": "PT2H25M",
        "segments": [
            {
                "carrierCode": "AI",
                "flightNumber": "2433",
                "aircraftCode": "32N",
                "departureAirport": "DEL",
                "arrivalAirport": "BOM",
                "departureTime": "2025-12-21T16:00:00.000Z",
                "arrivalTime": "2025-12-21T18:25:00.000Z",
                "duration": "PT2H25M",
                "cabin": "ECONOMY",
                "class": "V"
            }
        ]
    }
];
// await createSeatMapsForFlight(flights);
