import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import Redis from "ioredis";
const redis = new Redis({ host: "localhost", port: 6379 }); // connect to localhost by default or specify URL

import typeDefs from "./src/schemaType.js";
import resolvers from "./src/resolvers.js";
import connectDB from "./db.js";
import apiRouter from "./src/apiRouter.js";

// Create Express app and HTTP server
const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server instance and use drain plugin
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: async ({ req }) => ({ redis }),
});
await server.start();

// Attach Apollo middleware to /graphql route only
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:8083",
    ], // Only frontend origin allowed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // if needed
  })
);
app.use(
  "/graphql", // Only GraphQL requests hit this middleware
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ redis }),
  })
);

app.use("/apis", apiRouter);

// Start HTTP server
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log("🚀 Server ready at http://localhost:4000");
connectDB();
