import express from "express";
const appRouter = express.Router();

import airportRoutes from "./airports.js";
import offersRoutes from "./offers.js";
import flightsRoutes from "./flights.js";
import bookingsRoutes from "./bookings.js";
import addonsRoutes from "./addons.js";

appRouter.use("/airports", airportRoutes);
appRouter.use("/offers", offersRoutes);
appRouter.use("/search", flightsRoutes);
appRouter.use("/bookings", bookingsRoutes);
appRouter.use("/addons", addonsRoutes);

export default appRouter;
