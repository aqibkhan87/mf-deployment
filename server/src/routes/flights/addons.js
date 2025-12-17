import express from "express";
import AddonsModel from "../../models/flights/addons.js";

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  try {
    const addons = await AddonsModel.find();
    if (!addons) return res.status(404).json({ message: "Addons not found" });

    res.json({
      addons: addons,
    });
  } catch (err) {
    console.error("Error fetching addons:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
