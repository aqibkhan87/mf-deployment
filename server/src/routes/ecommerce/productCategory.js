import express from "express";
const apiRouter = express.Router();
import ProductCategoryModel from "../../models/ecommerce/e-product-category.js";
import ProductModel from "../../models/ecommerce/e-product.js";

apiRouter.get("/:categoryid", async (req, res) => {
  const categoryid = req.params.categoryid;

  const { minPrice, maxPrice, rating, sortBy } = req.query;
  console.log("Filters:", minPrice, maxPrice, rating, sortBy);

  // Step 1: fetch category
  const category = await ProductCategoryModel.findOne({ categoryid });
  if (!category) return res.status(404).send({ message: "Category not found" });

  // Step 2: build filters for products
  const productFilter = { categoryid };

  if (rating) productFilter.rating = { $gte: Number(rating) };
  if (minPrice && maxPrice)
    productFilter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

  // Step 3: sorting
  let sortQuery = {};
  if (sortBy === "price_low") sortQuery.price = 1;
  if (sortBy === "price_high") sortQuery.price = -1;
  if (sortBy === "newest") sortQuery.createdAt = -1;

  // Step 4: fetch filtered + sorted products + AGGREGATION PIPELINE
  const productCategory = await ProductModel.aggregate([
    {
      $addFields: {
        rating: { $toDouble: "$rating" },   // convert rating string → number
        price: { $toDouble: "$price" },            // convert price string → number
      }
    },
    { $match: productFilter },
    { $sort: sortQuery }
  ]);

  res.send(productCategory);
});

export default apiRouter;