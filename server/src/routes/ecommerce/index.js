import express from "express";
const apiRouter = express.Router();

import cartRoutes from "./cart.js";
import orderRoutes from "./order.js";
import productRoutes from "./product.js";
import wishlistRoutes from "./wishlist.js";
import orderBookingRoutes from "./orderBooking.js";
import productCategoryRoutes from "./productCategory.js";

apiRouter.use("/cart", cartRoutes);
apiRouter.use("/order", orderRoutes);
apiRouter.use("/product", productRoutes);
apiRouter.use("/wishlist", wishlistRoutes);
apiRouter.use("/order-booking", orderBookingRoutes);
apiRouter.use("/product-category", productCategoryRoutes);

export default apiRouter;