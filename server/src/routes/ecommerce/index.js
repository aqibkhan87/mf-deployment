import express from "express";
const apiRouter = express.Router();

import cartRoutes from "./cart.js";
import productRoutes from "./product.js";
import productCategoryRoutes from "./productCategory.js";
import orderBookingRoutes from "./orderBooking.js";

apiRouter.use("/cart", cartRoutes);
apiRouter.use("/product", productRoutes);
apiRouter.use("/product-category", productCategoryRoutes);
apiRouter.use("/order-booking", orderBookingRoutes);

export default apiRouter;