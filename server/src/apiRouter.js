import express from "express";
// Example REST API nested route
const apiRouter = express.Router();
import ProductModel from "../src/models/e-product.js";
import ProductCategoryModel from "../src/models/e-product-category.js";
import CartModel from "../src/models/e-cart.js";
import { calculateCartSummary } from "./utils/helper.js";

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

    console.log("carttttt", cartId);
    let cart = {};
    let cartCount = 0;
    if (cartId === "anonymous") {
      throw new Error("Invalid cart Id provided.");
    } else if (cartId) {
      cart = await CartModel.findOne({ _id: cartId }).populate(
        "products.productDetail"
      );
      cart?.products?.forEach((item) => {
        console.log("new cart item", item);
        cartCount += item?.quantity;
      });
    }

    res.json({
      cart: cart,
      cartCount: cartCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.put("/update-cart", async (req, res) => {
  try {
    const { cartId, products } = req.body;

    if (!cartId || cartId === "anonymous") {
      return res.status(400).json({ error: "Valid cart Id required." });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products not found." });
    }

    // Find the cart by ID
    let cart = await CartModel.findOne({ _id: cartId }).populate(
      "products.productDetail"
    );
    if (!cart) return res.status(404).json({ error: "Cart not found." });

    // Update quantities of specific products
    for (const { _id, quantity } of products) {
      console.log(quantity, "cart", cart, "_id", _id);
      if (quantity < 1) continue; // optionally skip invalid quantities
      const index = cart?.products?.findIndex(
        (item) => item?.productDetail?._id?.toString() === _id // Depending on your schema
      );
      console.log("indexindex", index);
      if (index > -1) {
        cart.products[index].quantity = quantity;
      }
    }

    cart = calculateCartSummary(cart);
    console.log("summary saved cart", cart);
    await cart.save();

    // Optionally populate products.productDetail before returning
    console.log("cart updated ", cart);
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default apiRouter;
