import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

import typeDefs from "./src/schemas/index.js";
import resolvers from "./src/resolvers/index.js";
import connectDB from "./db.js";
import apiRouter from "./src/apiRouter.js";

const redis = new Redis({ host: "localhost", port: 6379 });
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

// 🔥 context must be defined HERE, not inside ApolloServer()
app.use(
  "/graphql",
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:8083",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const { authorization } = req.headers;
      if (authorization) {
        try {
          const userId = jwt.verify(authorization, "SECRET");
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

app.use("/apis", apiRouter);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log("🚀 Server ready at http://localhost:4000");
connectDB();
