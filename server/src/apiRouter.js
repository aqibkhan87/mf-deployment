import express from "express";
const apiRouter = express.Router();

import flightRoutes from "./routes/flights/index.js"
import eCommerceRoutes from "./routes/ecommerce/index.js"

apiRouter.get("/health", (req, res) => res.json({ status: "API is healthy" }));

apiRouter.use('/ecommerce', eCommerceRoutes)
apiRouter.use('/flights', flightRoutes)

export default apiRouter;
