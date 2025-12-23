import express from "express";
import SeatMapModel from "../../models/flights/seatMap.js";

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  try {
    const seatMap = await SeatMapModel.find({
      itineraryKey: req.query.itineraryKey,
    });
    if (!seatMap) return res.status(404).json({ message: "SeatMap not found" });

    res.json({
      seatMap: seatMap,
    });
  } catch (err) {
    console.error("Error fetching seatMap:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
