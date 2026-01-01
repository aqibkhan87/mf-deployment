import express from "express";
import AviationPaymentModel from "../../models/flights/aviation-payment.js";
import BookingModel from "../../models/flights/booking.js";
import AddonModel from "../../models/flights/addons.js";
import SeatMapModel from "../../models/flights/seatMap.js";
import { razorpay } from "../../razorpayService.js";

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

    updatedPassengers.forEach((p) => {
      let checkinAmount = p?.checkinAmount;
      let seatsPrice = 0;
      let currentSeatsTotal = 0;
      let paidSeatsTotal = 0;

      for (let [key, value] of Object.entries(p?.seats)) {
        if (p?.seats?.[key]) {
          currentSeatsTotal += Number(value?.price) || 0;
        }
      }
      for (let [key, value] of Object.entries(p?.paidSeats)) {
        if (p?.seats?.[key]) {
          paidSeatsTotal += Number(value?.price) || 0;
        }
      }
      seatsPrice = Math.max(0, currentSeatsTotal - paidSeatsTotal);
      checkinAmount.seatsPrice = Number(seatsPrice);
      checkinAmount.totalPrice =
        Number(seatsPrice) + Number(checkinAmount.addonsPrice);
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
    console.error("Error updating seats for checkin Details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

apiRouter.put("/payment", async (req, res) => {
  try {
    const { entityId, passengers } = req.body;
    const booking = await BookingModel.findOne({ _id: entityId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Normalize passenger IDs coming from frontend
    const requestedPassengerIds = (passengers || []).map((p) =>
      p.id?.toString()
    );

    // Backend decides payable passengers
    const payablePassengers = booking.passengers.filter(
      (p) =>
        requestedPassengerIds.includes(p?.id) &&
        p.checkinAmount?.totalPrice > 0 &&
        p.checkinAmount?.isPaid !== true
    );

    if (!payablePassengers.length) {
      return res.status(400).json({ message: "No payable passengers" });
    }

    const totalAddonsPrice = payablePassengers.reduce(
      (sum, p) => sum + p.checkinAmount.addonsPrice,
      0
    );
    const totalSeatsPrice = payablePassengers.reduce(
      (sum, p) => sum + p.checkinAmount.seatsPrice,
      0
    );
    const totalPrice = payablePassengers.reduce(
      (sum, p) => sum + p.checkinAmount.totalPrice,
      0
    );

    const order = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // paise
      currency: "INR",
      receipt: `Avition_${booking?._id}`,
    });

    // ✅ Create payment record
    const payment = await AviationPaymentModel.create({
      amount: totalPrice,
      bookingId: booking?._id,
      razorpay_order_id: order.id,
      receipt: order?.receipt,
      passengerIds: payablePassengers?.map((p) => p.id),
      type: "CHECKIN",
      breakdown: {
        addons: totalAddonsPrice,
        seats: totalSeatsPrice,
        total: totalPrice,
      },
    });

    await payment.save();

    res.json({
      orderId: order?.id,
      amount: order?.amount,
      currency: order?.currency,
      paymentId: payment?._id,
    });
  } catch (err) {
    console.error(
      "Check in Payment Passengers addons and seat payment error:",
      err
    );
    res.status(500).json({ message: "Server error" });
  }
});

apiRouter.post("/verify-payment", async (req, res) => {
  try {
    const {
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
      await AviationPaymentModel.findByIdAndUpdate(entityId, {
        status: "FAILED",
      });
      return res.status(400).json({ success: false });
    }

    await markSuccess(type, entityId, {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

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

async function markSuccess(id, payment) {
  const aviationPayment = await AviationPaymentModel.findOneAndUpdate(
    {
      razorpay_order_id: payment.razorpay_order_id,
    },
    {
      status: "COMPLETED",
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,
      paidAt: new Date(),
    }
  );
  const booking = await BookingModel.findById(id);
  booking.bookingStatus = "COMPLETED";
  for (const passenger of booking.passengers) {
    passenger.checkinAmount.isPaid = true;
    await seatBooking("reserved", passenger?.seats, passenger);
    await seatBooking("free", passenger?.paidSeats, passenger);
  }
  await booking.save();

  await sendMail({
    to: booking?.contact?.email,
    subject: `Your Check-in for Flight Booking is Done Against ${aviationPayment?.PNR} ✈️`,
    html: flightConfirmationTemplate(booking, aviationPayment?.PNR),
  });
}

const seatBooking = async (type = "free", seatData, passenger) => {
  for (const [segmentKey, paidSeat] of seatData?.entries() || {}) {
    const paidSeatData = paidSeat.toObject(); // convert to plain object
    if (paidSeatData?.seatNumber) {
      await SeatMapModel.updateOne(
        { flightInstanceKey: segmentKey },
        {
          $set: {
            [`seatStatus.${paidSeatData.cabin}.${paidSeatData.seatNumber}.status`]:
              type === "free" ? "available" : "reserved",
            [`seatStatus.${paidSeatData.cabin}.${paidSeatData.seatNumber}.passengerId`]:
              type === "free" ? "" : passenger?.id,
            [`seatStatus.${paidSeatData.cabin}.${paidSeatData.seatNumber}.reservedAt`]:
              type === "free" ? "" : new Date(),
          },
        }
      );
    }
  }
};

export default apiRouter;
