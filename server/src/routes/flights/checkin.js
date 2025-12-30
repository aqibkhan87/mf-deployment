import express from "express";
import AviationPaymentModel from "../../models/flights/aviation-payment.js";
import BookingModel from "../../models/flights/booking.js";

const apiRouter = express.Router();

apiRouter.get("/retrieve-pnr", async (req, res) => {
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
        destinationAirport: checkinDetails?.bookingId?.destinationAirport,
        connectingAirports: checkinDetails?.bookingId?.connectingAirports,
        bookingId: checkinDetails?.bookingId?._id
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

apiRouter.get("/passengers-addons/:bookingId", async (req, res) => {
  try {
    const { passengerIds, isAll = false } = req?.query;
    const { bookingId } = req?.params;
    if ((!passengerIds?.length && !isAll) || !bookingId) {
      return res.status(404).json({ message: "Missing Details" });
    }

    const addonsCheckinDetails = await BookingModel.findOne({
      _id: bookingId,
    }).populate("passengers.addons");

    if (!addonsCheckinDetails)
      return res.status(404).json({ message: "Addons Checkin Details not found" });

    let passengers = [];
    if(passengerIds?.length) {
      for(let id of passengerIds) {
        passengers = addonsCheckinDetails?.passengers?.filter((pass) => pass?.id === id)
      }
    } else if(isAll) {
      passengers = addonsCheckinDetails?.passengers;
    }

    const response = {
        date: addonsCheckinDetails?.date,
        passengers: passengers,
        flightDetail: {
          duration: addonsCheckinDetails?.flightDetail?.duration,
          providerId: addonsCheckinDetails?.flightDetail?.providerId,
          segments: addonsCheckinDetails?.flightDetail?.segments,
          travelerPricing: addonsCheckinDetails?.flightDetail?.travelerPricing,
        },
        sourceAirport: addonsCheckinDetails?.sourceAirport,
        destinationAirport: addonsCheckinDetails?.destinationAirport,
        connectingAirports: addonsCheckinDetails?.connectingAirports,
        bookingId: addonsCheckinDetails?._id
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
