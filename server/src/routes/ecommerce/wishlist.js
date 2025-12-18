import express from "express";
const apiRouter = express.Router();

import Wishlist from "../../models/ecommerce/e-wishlist.js";

apiRouter.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;

    const wishlist = await Wishlist.find({ userId })
      .populate("product") 
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      wishlist: wishlist,
      wishlistCount: wishlist?.length || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
});

apiRouter.post("/add", async (req, res) => {
  try {
    const userId = req.query.userId;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ userId, product: productId });
    if (exists) {
      return res.json({ success: true, message: "Already saved" });
    }

    await Wishlist.create({ userId, product: productId });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

apiRouter.delete("/:productId", async (req, res) => {
  try {
    const userId = req.query.userId;
    const productId = req.params.productId;

    await Wishlist.deleteOne({ userId, product: productId });

    res.json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });
  }
});

export default apiRouter;
