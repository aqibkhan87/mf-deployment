import express from "express";
import AviationPaymentModel from "../../models/flights/aviation-payment.js";

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  try {
    const { orderId, PNR, status } = req?.query;
    if (!status || !orderId || !PNR) {
      return res.status(404).json({ message: "Missing Details" });
    }
    const itineraryDetails = await AviationPaymentModel.findOne({
      status: status,
      razorpay_order_id: orderId,
      PNR: PNR,
    }).populate({
      path: "bookingId",
      populate: {
        path: "passengers.addons",
        model: "addons",
      },
    });
    if (!itineraryDetails)
      return res.status(404).json({ message: "Itinerary not found" });

    const response = {
      amount: itineraryDetails?.amount,
      bookingDetails: itineraryDetails?.bookingId,
      currency: itineraryDetails.currency,
      gateway: itineraryDetails.gateway,
      paidAt: itineraryDetails?.paidAt,
      receipt: itineraryDetails?.receipt,
      status: itineraryDetails?.status,
    };
    res.json({
      itineraryDetails: response,
    });
  } catch (err) {
    console.error("Error fetching itineraryDetails:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
