import express from "express";
const apiRouter = express.Router();

// import OrderModel from "../../models/ecommerce/e-orders.js";
import PaymentModel from "../../models/ecommerce/e-payment.js";

apiRouter.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;

    const orders = await PaymentModel.find({ userId })
      .populate({
        path: "cartId",
        populate: {
          path: "products.productDetail",
          model: "product",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders: orders,
      ordersCount: orders?.length || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Orders",
    });
  }
});

apiRouter.get("/:orderId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    await PaymentModel.findOne({ userId, _id: orderId });

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
