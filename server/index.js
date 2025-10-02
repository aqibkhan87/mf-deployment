import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';

import typeDefs from "./src/schemaType.js";
import resolvers from './src/resolvers.js';
import connectDB from './db.js';
import apiRouter from './src/apiRouter.js';

// Create Express app and HTTP server
const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server instance and use drain plugin
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

// Attach Apollo middleware to /graphql route only
app.use(
  '/graphql', // Only GraphQL requests hit this middleware
  cors(),
  express.json(),
  expressMiddleware(server)
);

app.use('/apis', apiRouter);

// Start HTTP server
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('🚀 Server ready at http://localhost:4000');
connectDB();
