import express from "express";
const appRouter = express.Router();

import airportRoutes from "./airports.js";
import flightsRoutes from "./flights.js";
import bookingsRoutes from "./bookings.js";
import addonsRoutes from "./addons.js";
import seatMapRoutes from "./seatMap.js";
import itineraryRoutes from "./itinerary.js";

appRouter.use("/airports", airportRoutes);
appRouter.use("/search", flightsRoutes);
appRouter.use("/bookings", bookingsRoutes);
appRouter.use("/addons", addonsRoutes);
appRouter.use("/seatmap", seatMapRoutes);
appRouter.use("/itinerary", itineraryRoutes);

export default appRouter;
