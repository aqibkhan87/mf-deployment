import express from "express";
import AviationPaymentModel from "../../models/flights/aviation-payment.js";

const apiRouter = express.Router();

apiRouter.get("/retrieve", async (req, res) => {
  try {
    const { emailOrLastName, PNR } = req?.query;
    if (!emailOrLastName || !PNR) {
      return res.status(404).json({ message: "Missing Details" });
    }

    const checkinDetails = await AviationPaymentModel.findOne({
      PNR: PNR,
    }).populate({
      path: "bookingId",
      $match: [
        { "passengers.lastName": emailOrLastName }, // match any passenger last name
        { "contact.email": emailOrLastName }, // match contact email
      ],
    });

    if (!checkinDetails)
      return res.status(404).json({ message: "Checkin Details not found" });

    const response = {
      bookingDetails: {
        date: checkinDetails?.bookingId?.date,
        contact: checkinDetails?.bookingId?.contact,
        passengers: checkinDetails?.bookingId?.passengers,
        flightDetail: checkinDetails?.bookingId?.flightDetail,
        sourceAirport: checkinDetails?.bookingId?.sourceAirport,
        connectingAirports: checkinDetails?.bookingId?.connectingAirports,
        destinationAirport: checkinDetails?.bookingId?.destinationAirport,
        connectingAirports: checkinDetails?.bookingId?.connectingAirports,
      },
      PNR: checkinDetails?.PNR,
    };
    res.json({
      checkinDetails: response,
    });
  } catch (err) {
    console.error("Error fetching checkin Details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
