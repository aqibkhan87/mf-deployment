import express from "express";
const apiRouter = express.Router();
import ProductCategoryModel from "../../models/ecommerce/e-product-category.js";

apiRouter.get("/:categoryid", async (req, res) => {
  const categoryid = req.params.categoryid;
  const productCategory = await ProductCategoryModel.findOne({
    categoryid: categoryid,
  }).populate("products");
  if (!productCategory) {
    throw new Error({ message: "Product Category doesn't exist" });
  }
  res.send(productCategory);
});

export default apiRouter;