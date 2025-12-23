import express from "express";
import SeatMapModel from "../../models/flights/seatMap.js";

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  try {
    const seatMaps = await SeatMapModel.find({
      itineraryKey: req.query.itineraryKey,
    });
    if (!seatMaps) return res.status(404).json({ message: "SeatMaps not found" });

    res.json({
      seatMaps: seatMaps,
    });
  } catch (err) {
    console.error("Error fetching seatMap:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
