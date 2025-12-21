import express from "express";
import SeatMapModel from "../../models/flights/seatMap.js";

const apiRouter = express.Router();

apiRouter.get("/:flightInstanceKey", async (req, res) => {
  try {
    console.log("Fetching seatMap for flightInstanceKey:", req.params.flightInstanceKey);
    const seatMap = await SeatMapModel.findOne({
      flightInstanceKey: req.params.flightInstanceKey,
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
