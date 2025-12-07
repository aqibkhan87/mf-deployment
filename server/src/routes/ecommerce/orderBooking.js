import express from "express";
const apiRouter = express.Router();
import crypto from "crypto";
import { razorpay } from "../../razorpayService.js";
import CartModel from "../../models/ecommerce/e-cart.js";

apiRouter.post("/generate-token", async (req, res) => {
  try {
    const { cartId } = req.body;
    if (!cartId) return res.status(400).json({ error: "cartId required" });

    // load cart and calculate summary
    let cart = await CartModel.findById(cartId).populate("products.productDetail");
    if (!cart) return res.status(404).json({ error: "Cart not found." });

    const total =
      (cart?.summary?.total ?? cart?.totalAmount ?? 0); // summary.total expected, fallback
    if (!total || total <= 0)
      return res.status(400).json({ error: "Cart total must be greater than zero." });

    const amountInPaise = Math.round(total * 100); // Razorpay expects amount in smallest currency unit

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt || `rcpt_${cart._id}`,
      payment_capture: 1,
      notes: {
        cartId: String(cart._id),
        userId: String(cart.userId ?? ""),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      receipt: order.receipt,
    });
  } catch (err) {
    console.error("razorpay generate-token error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

apiRouter.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields." });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay secret not configured." });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature. Payment verification failed." });
    }

    // At this point payment is verified by signature. Optionally you can
    // further validate payment status via Razorpay payments API if desired.

    // Attach payment info to cart (if cartId provided)
    if (cartId) {
      const cart = await CartModel.findById(cartId);
      if (cart) {
        cart.payment = cart.payment || {};
        cart.payment.razorpayOrderId = razorpay_order_id;
        cart.payment.razorpayPaymentId = razorpay_payment_id;
        cart.payment.razorpaySignature = razorpay_signature;
        cart.payment.status = "VERIFIED";
        cart.payment.verifiedAt = new Date();
        await cart.save();
      }
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (err) {
    console.error("razorpay verify-payment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default apiRouter;