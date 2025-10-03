import express from "express";
// Example REST API nested route
const apiRouter = express.Router();
import ProductModel from "../models/e-product.js";
import ProductCategoryModel from "../models/e-product-category.js";

apiRouter.get("/health", (req, res) => res.json({ status: "API is healthy" }));

apiRouter.get("/product/:productid", async (req, res) => {
  const productid = req.params.productid;
  const product = await ProductModel.findOne({ _id: productid });
  if (!product) {
    throw new Error({ message: "Product doesn't exist" });
  }
  res.send(product);
});

apiRouter.get("/product-category/:categoryid", async (req, res) => {
  const categoryid = req.params.categoryid;
  const productCategory = await ProductCategoryModel.findOne({ categoryid: categoryid }).populate('products');
  if (!productCategory) {
    throw new Error({ message: "Product Category doesn't exist" });
  }
  res.send(productCategory);
});

export default apiRouter;
