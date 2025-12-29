// routes/payments.js
import express from "express";
import crypto from "crypto";
import { razorpay } from "../razorpayService.js";
import CartModel from "../models/ecommerce/e-cart.js";
import BookingModel from "../models/flights/booking.js";
import EcommercePayment from "../models/ecommerce/e-payment.js";
import AviationPaymentModel from "../models/flights/aviation-payment.js";
import SeatMapModel from "../models/flights/seatMap.js";
import { sendMail } from "../services/mailService.js";
import { flightConfirmationTemplate } from "../utils/template.js";

const apiRouter = express.Router();

apiRouter.post("/create", async (req, res) => {
  try {
    const { entityId, type } = req.body;
    let cart;
    let booking;

    if (type === "ECOMMERCE") {
      cart = await CartModel.findOne({ _id: entityId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
    } else if (type === "FLIGHT") {
      booking = await BookingModel.findOne({ _id: entityId });
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });
    }

    let order;
    let payment;

    if (cart) {
      const amount = cart?.totalAmount || 0;

      // ✅ Create Razorpay order
      order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `Ecommerce_${cart?._id}`,
      });

      // ✅ Create payment record
      payment = await EcommercePayment.create({
        userId: cart.userId,
        cartId: cart._id,
        amount,
        razorpay_order_id: order.id,
      });
      await payment.save();
    }

    if (type === "FLIGHT") {
      const amount = booking?.priceBreakdown?.totalPrice || 0;
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt: `Avition_${booking?._id}`,
      });

      // ✅ Create payment record
      payment = await AviationPaymentModel.create({
        amount,
        bookingId: booking?._id,
        razorpay_order_id: order.id,
        receipt: order?.receipt,
      });

      await payment.save();
    }

    res.json({
      orderId: order?.id,
      amount: order?.amount,
      currency: order?.currency,
      paymentId: payment?._id,
    });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   VERIFY PAYMENT
============================= */
apiRouter.post("/verify-payment", async (req, res) => {
  try {
    const {
      type,
      entityId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      await markFailed(type, entityId, razorpay_order_id);
      return res.status(400).json({ success: false });
    }

    const { PNR } = await markSuccess(type, entityId, {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    if (type === "FLIGHT") {
      return res.json({
        success: true,
        orderId: razorpay_order_id,
        status: "COMPLETED",
        PNR: PNR,
      });
    }

    res.json({
      success: true,
      orderId: razorpay_order_id,
      status: "COMPLETED",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

async function markSuccess(type, id, payment) {
  if (type === "ECOMMERCE") {
    await EcommercePayment.findOneAndUpdate(
      { razorpay_order_id: payment.razorpay_order_id },
      {
        status: "COMPLETED",
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
        paidAt: new Date(),
      }
    );
    await CartModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        cartStatus: "COMPLETED",
      }
    );
  }

  if (type === "FLIGHT") {
    const PNR = generatePNR();
    await AviationPaymentModel.findOneAndUpdate(
      {
        razorpay_order_id: payment.razorpay_order_id,
      },
      {
        status: "COMPLETED",
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
        paidAt: new Date(),
        PNR: PNR,
      }
    );
    const booking = await BookingModel.findById(id);
    booking.bookingStatus = "COMPLETED";
    for (const passenger of booking.passengers) {
      for (const [segmentKey, seat] of Object.entries(passenger.seats || {})) {
        await SeatMapModel.updateOne(
          { flightInstanceKey: segmentKey },
          {
            $set: {
              [`seatStatus.${seat.cabin}.${seat.seatNumber}`]: "reserved",
            },
          }
        );
      }
    }
    await booking.save();

    await sendMail({
      to: booking?.contact?.email,
      subject: "Your Flight Booking is Confirmed ✈️",
      html: flightConfirmationTemplate(booking, PNR)
    });

    return { PNR: PNR };
  }
}

async function markFailed(type, id, orderId) {
  if (type === "ECOMMERCE") {
    await EcommercePayment.findOneAndUpdate(
      { razorpay_order_id: orderId },
      { status: "FAILED" }
    );
  }

  if (type === "FLIGHT") {
    await AviationPaymentModel.findByIdAndUpdate(id, { status: "FAILED" });
  }
}

function generatePNR() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pnr = "";

  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return pnr;
}

export default apiRouter;
