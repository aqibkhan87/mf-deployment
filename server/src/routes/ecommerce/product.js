import express from "express";
const apiRouter = express.Router();
import ProductModel from "../../models/ecommerce/e-product.js";

apiRouter.get("/:productid", async (req, res) => {
  const productid = req.params.productid;
  const product = await ProductModel.findOne({ _id: productid });
  if (!product) {
    throw new Error({ message: "Product doesn't exist" });
  }
  res.send(product);
});

export default apiRouter;