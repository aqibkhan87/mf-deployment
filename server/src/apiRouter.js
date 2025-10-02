import express from "express";
// Example REST API nested route
const apiRouter = express.Router();
apiRouter.get("/health", (req, res) => res.json({ status: "API is healthy" }));

export default apiRouter;
