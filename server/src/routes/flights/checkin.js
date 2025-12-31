import express from "express";
import AviationPaymentModel from "../../models/flights/aviation-payment.js";
import BookingModel from "../../models/flights/booking.js";
import AddonModel from "../../models/flights/addons.js";
import SeatMapModel from "../../models/flights/seatMap.js";

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
        bookingId: checkinDetails?.bookingId?._id,
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
    }).populate("passengers.addons passengers.paidAddons");

    if (!addonsCheckinDetails)
      return res
        .status(404)
        .json({ message: "Addons Checkin Details not found" });

    let passengers = [];
    if (passengerIds?.length) {
      for (let id of passengerIds) {
        passengers = addonsCheckinDetails?.passengers?.filter(
          (pass) => pass?.id === id
        );
      }
    } else if (isAll) {
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
      bookingId: addonsCheckinDetails?._id,
    };
    res.json({
      checkinDetails: response,
    });
  } catch (err) {
    console.error("Error fetching checkin Details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

apiRouter.put("/update-passengers-addons", async (req, res) => {
  try {
    const { passengers: updatedPassengers, bookingId } = req?.body;
    if (!updatedPassengers?.length || !bookingId) {
      return res.status(404).json({ message: "Missing Details" });
    }

    const booking = await BookingModel.findOne({
      _id: bookingId,
    }).populate("passengers.addons passengers.paidAddons");

    if (!booking)
      return res.status(404).json({ message: "Checkin Details not found" });

    const addonIds = [
      ...updatedPassengers.flatMap((p) => p.addons || []),
      ...updatedPassengers.flatMap((p) => p.paidAddons || []),
    ];

    const addons = await AddonModel.find({ _id: { $in: addonIds } }).lean();

    const addonPriceMap = new Map(
      addons.map((a) => [a._id.toString(), a.price])
    );

    const sumAddonsPriceByIds = (addonIds = []) =>
      addonIds.reduce(
        (sum, id) => sum + Number(addonPriceMap.get(id.toString()) || 0),
        0
      );

    updatedPassengers.forEach((p) => {
      // Calculate addons price
      if (p.addons && p.addons.length > 0) {
        const currentAddonsTotal = sumAddonsPriceByIds(p.addons || []);

        const paidAddonsTotal = sumAddonsPriceByIds(p.paidAddons || []);

        const addonsDelta = Math.max(0, currentAddonsTotal - paidAddonsTotal);

        p.checkinAmount = {
          addonsPrice: addonsDelta,
          totalPrice: addonsDelta,
        };
      } else {
        // Remove empty addons array
        p.addons = [];
      }
    });

    // 4️⃣ Return updated booking
    await BookingModel.findByIdAndUpdate(
      { _id: bookingId },
      { passengers: updatedPassengers },
      { new: true }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Error updating addons for checkin Details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

apiRouter.put("/update-passengers-seats", async (req, res) => {
  try {
    const {
      passengers: updatedPassengers,
      bookingId,
      itineraryKey,
    } = req?.body;
    if (!updatedPassengers?.length || !bookingId) {
      return res.status(404).json({ message: "Missing Details" });
    }

    const booking = await BookingModel.findOne({
      _id: bookingId,
    }).populate("passengers.addons passengers.paidAddons");

    if (!booking)
      return res.status(404).json({ message: "Checkin Details not found" });

    const seatMap = await SeatMapModel.findOne({
      itineraryKey: itineraryKey,
    });

    if (!seatMap) {
      return res.status(404).json({ message: "Seat map not found" });
    }

    // 4️⃣ Return updated booking
    await BookingModel.findByIdAndUpdate(
      { _id: bookingId },
      { passengers: updatedPassengers },
      { new: true }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Error updating addons for checkin Details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default apiRouter;
