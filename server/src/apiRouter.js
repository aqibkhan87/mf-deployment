import express from "express";
// Example REST API nested route
const apiRouter = express.Router();
import ProductModel from "../models/e-product.js";
import ProductCategoryModel from "../models/e-product-category.js";
import CartModel from "../models/e-cart.js";

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
  const productCategory = await ProductCategoryModel.findOne({
    categoryid: categoryid,
  }).populate("products");
  if (!productCategory) {
    throw new Error({ message: "Product Category doesn't exist" });
  }
  res.send(productCategory);
});

apiRouter.post("/add-to-cart", async (req, res) => {
  try {
    const { userId, cartId = "", products } = req.body;
    if (!Array.isArray(products) || products?.length === 0) {
      return res.status(400).json({ error: "No products provided." });
    }
    console.log("req.body", req.body);
    // Find or create cart
    let cart = "";
    if (cartId?.length) {
      cart = await CartModel.findOne({ cartId, userId }).populate("products");
      console.log("rexisting cart", cart);
    }
    if (!cart) {
      cart = new CartModel({ userId, products });
      console.log("new cart", cart);
      await cart.save();
    }

    for (const { productDetail, quantity = 1 } of products) {
      // Fetch product details
      const product = await ProductModel.findById(productDetail?._id);
      console.log("product product", product);
      if (!product) continue; // skip missing

      // Check if product is already in cart
      const index = cart?.products?.findIndex((item) =>
        item?._id?.equals(product?.productDetail?._id)
      );
      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({
          productId: product._id,
          quantity,
        });
      }
    }

    await cart.save();

    res.json({
      cartId: cart._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.get("/get-cart/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    console.log("carttttt", cartId)
    let cart = {};
    if (cartId === "anonymous") {
      throw new Error("Invalid cart Id provided.");
    } else if (cartId) {
      cart = await CartModel.findOne({ _id: cartId }).populate(
        "products.productDetail"
      );
      console.log("new cart", cart);
    }

    res.json({
      cart: cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default apiRouter;
