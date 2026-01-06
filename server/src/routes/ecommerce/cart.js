import express from "express";
const apiRouter = express.Router();

import CartModel from "../../models/ecommerce/e-cart.js";
import ProductModel from "../../models/ecommerce/e-product.js";
import { calculateCartSummary, mergeProducts } from "../../utils/helper.js";

apiRouter.post("/", async (req, res) => {
  try {
    const { userId = null, cartId = null, products = [] } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    let cart = null;

    if (cartId) {
      cart = await CartModel.findById(cartId);
    }

    if (!cart && userId !== "anonymous") {
      cart = await CartModel.findOne({
        userId,
        cartStatus: { $ne: "COMPLETED" },
      });
    }

    if (!cart) {
      cart = new CartModel({
        userId: userId || "anonymous",
        products: [],
      });
    }

    let totalAmount = 0;
    let totalActual = 0;

    for (const { _id, quantity = 1 } of products) {
      const product = await ProductModel.findById(_id);
      if (!product) continue;

      const index = cart.products.findIndex(
        (item) => item.productDetail.toString() === _id
      );
      if (index > -1) {
        cart.products[index].quantity = quantity;
      } else {
        cart.products.push({
          productDetail: product._id,
          quantity,
        });
      }
      const actualPrice = Number(product.actualPrice) || 0;

      totalActual += actualPrice * quantity;
      totalAmount += product.price * quantity;
    }
    cart.totalAmount = totalAmount.toFixed(2);
    cart.totalActual = totalActual.toFixed(2);
    cart.savedAmount = (totalActual - totalAmount).toFixed(2);

    await cart.save();

    res.json({
      success: true,
      cartId: cart._id,
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    let cart = {};
    let cartCount = 0;
    if (cartId === "") {
      throw new Error("Invalid cart Id provided.");
    } else if (cartId) {
      cart = await CartModel.findOne({
        _id: cartId,
        cartStatus: { $ne: "COMPLETED" },
      }).populate("products.productDetail");
      if (!cart) {
        return res.json({
          cart: null,
        });
      }
      cart?.products?.forEach((item) => {
        cartCount += item?.quantity;
      });
    }
    cart = calculateCartSummary(cart);

    res.json({
      cart: cart,
      cartCount: cartCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.put("/update", async (req, res) => {
  try {
    const { cartId, products } = req.body;

    if (!cartId || cartId === "") {
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
      const index = cart?.products?.findIndex(
        (item) => item?.productDetail?._id?.toString() === _id // Depending on your schema
      );
      if (index > -1) {
        if (quantity <= 0) {
          // ⛔ REMOVE item if quantity is 0
          cart.products.splice(index, 1);
        } else {
          // ✔ Update quantity
          cart.products[index].quantity = quantity;
        }
      }
    }

    cart = calculateCartSummary(cart);
    await cart.save();
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.put("/update-userid-in-cart", async (req, res) => {
  try {
    const { userId, guestCartId, SyncProducts } = req.body;

    if (!guestCartId || !userId) {
      return res.status(400).json({ error: "Valid cart Id required." });
    }

    const guestCart = await CartModel.findById(guestCartId);
    let userCart = await CartModel.findOne({ userId }).populate(
      "products.productDetail"
    );

    if (!SyncProducts) {
      return res.json({
        merged: false,
        message: "Cart sync skipped by user choice.",
        cart: userCart || {},
      });
    }

    if (!userCart) {
      guestCart.userId = userId;
      await guestCart.save();
      return res.json({ cart: guestCart, merged: false });
    }

    userCart.products = mergeProducts(userCart.products, guestCart.products);
    userCart = calculateCartSummary(userCart);
    await userCart.save();
    await CartModel.deleteOne({ _id: guestCartId }); // delete guest cart

    res.json({
      cart: userCart,
      merged: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.delete("/:cartId/product/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    if (!cartId || !productId) {
      return res.status(400).json({ error: "Invalid cart or product id" });
    }

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // ✅ Remove product
    cart.products = cart.products.filter(
      (item) => item?.productDetail?.toString() !== productId
    );

    // ✅ Recalculate totals
    let cartCount = 0;
    let totalAmount = 0;
    let totalActual = 0;

    for (const item of cart?.products) {
      const product = await ProductModel.findById(item.productDetail);
      if (!product) continue;

      cartCount += item.quantity;

      const actualPrice = Number(product.actualPrice || product.price);
      const sellingPrice = Number(product.discountedPrice || product.price);

      totalActual += actualPrice * item.quantity;
      totalAmount += sellingPrice * item.quantity;
    }

    cart.totalActual = totalActual.toFixed(2);
    cart.totalAmount = totalAmount.toFixed(2);
    cart.savedAmount = (totalActual - totalAmount).toFixed(2);

    // ✅ If cart empty → delete cart (recommended)
    if (cart.products.length === 0) {
      await CartModel.findByIdAndDelete(cartId);
      return res.json({
        success: true,
        cart: null,
        cartCount: 0,
      });
    }

    await cart.save();

    res.json({
      success: true,
      cart,
      cartCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default apiRouter;
