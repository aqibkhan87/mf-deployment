import express from "express";
import crypto from "crypto";
import AviationPaymentModel from "../../models/flights/aviation-payment.js";
import BookingModel from "../../models/flights/booking.js";
import AddonModel from "../../models/flights/addons.js";
import SeatMapModel from "../../models/flights/seatMap.js";
import BoardingPassModel from "../../models/flights/boardingPassModel.js";
import { razorpay } from "../../razorpayService.js";
import { sendMail } from "../../services/mailService.js";
import { boardingPassMailTemplate } from "../../utils/template.js";
import {
  generateBoardingPassPDF,
  generateQRCode,
  buildBarcodePayload,
} from "../../utils/helper.js";

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

// using post instead of get, becoz we have to receive multiple passengers it can increase url length.
apiRouter.post("/passengers-addons/:bookingId", async (req, res) => {
  try {
    const { passengerIds, isAll = false } = req?.body;
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
        passengers.push(
          addonsCheckinDetails?.passengers?.find((pass) => pass?.id === id)
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

    const updatedPassengerMap = new Map(
      updatedPassengers?.map((p) => [String(p.id), p])
    );

    const sumAddonsPriceByIds = (addonIds = []) =>
      addonIds.reduce(
        (sum, id) => sum + Number(addonPriceMap.get(id.toString()) || 0),
        0
      );

    booking.passengers = booking?.passengers?.map((p) => {
      const incoming = updatedPassengerMap.get(String(p.id));

      if (!incoming) {
        // passenger not part of this check-in → keep as-is
        return p;
      }
      // Calculate addons price
      if (incoming?.addons && incoming?.addons?.length > 0) {
        const currentAddonsTotal = sumAddonsPriceByIds(incoming.addons || []);

        const paidAddonsTotal = sumAddonsPriceByIds(incoming.paidAddons || []);

        const addonsDelta = Math.max(0, currentAddonsTotal - paidAddonsTotal);

        p.checkinAmount.addonsPrice = addonsDelta;
        p.checkinAmount.totalPrice = addonsDelta;
      } else {
        // Remove empty addons array
        p.addons = [];
      }
      return p;
    });

    // 4️⃣ Return updated booking
    await booking.save();

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

    const updatedPassengerMap = new Map(
      updatedPassengers?.map((p) => [String(p.id), p])
    );

    booking.passengers = booking?.passengers.map((p) => {
      const incoming = updatedPassengerMap.get(String(p.id));

      if (!incoming) {
        // passenger not part of this check-in → keep as-is
        return p;
      }

      let seatsPrice = 0;
      let currentSeatsTotal = 0;
      let paidSeatsTotal = 0;

      for (let [key, value] of Object.entries(incoming?.seats)) {
        if (p?.seats?.[key]) {
          currentSeatsTotal += Number(value?.price) || 0;
        }
      }
      for (let [key, value] of Object.entries(incoming?.paidSeats)) {
        if (p?.seats?.[key]) {
          paidSeatsTotal += Number(value?.price) || 0;
        }
      }
      seatsPrice = Math.max(0, currentSeatsTotal - paidSeatsTotal);
      p.checkinAmount.seatsPrice = Number(seatsPrice);
      p.checkinAmount.totalPrice =
        Number(seatsPrice) + Number(p.checkinAmount.addonsPrice);
      return p;
    });

    // 4️⃣ Return updated booking
    await booking.save();

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

apiRouter.put("/verify-payment", async (req, res) => {
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
      await AviationPaymentModel.findByIdAndUpdate(
        { razorpay_order_id: razorpay_order_id },
        {
          status: "FAILED",
        }
      );
      return res.status(400).json({ success: false });
    }

    await markSuccess(req, entityId, {
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

async function markSuccess(req, id, payment) {
  // document of payment while checkin.
  const aviationPayment = await AviationPaymentModel.findOne({
    razorpay_order_id: payment.razorpay_order_id,
  });
  if (!aviationPayment) {
    throw new Error("Check-in payment record not found");
  }
  if (aviationPayment.status === "COMPLETED") {
    return res.status(200).json({ message: "Payment already processed" });
  }
  aviationPayment.status = "COMPLETED";
  aviationPayment.razorpay_payment_id = payment.razorpay_payment_id;
  aviationPayment.razorpay_signature = payment.razorpay_signature;
  aviationPayment.paidAt = new Date();
  // document of payment while booking.
  const bookingAviationPayment = await AviationPaymentModel.findOne({
    bookingId: id,
    PNR: { $exists: true },
  });
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new Error("Booking not found");
  }
  const passengerIds = aviationPayment?.passengerIds;
  // update seats for individual or all passengers.
  // Backend decides payable passengers
  const payablePassengers = booking.passengers.filter(
    (p) =>
      passengerIds.includes(String(p?.id)) &&
      p.checkinAmount?.totalPrice > 0 &&
      p.checkinAmount?.isPaid !== true
  );
  for (const passenger of payablePassengers) {
    // passenger.checkinAmount.isPaid = true;
    await seatBooking("free", passenger?.paidSeats, passenger);
    await seatBooking("reserved", passenger?.seats, passenger);
  }

  let pdfPath = await createBoardingPass(
    booking,
    payablePassengers,
    bookingAviationPayment?.PNR,
    payment.razorpay_payment_id
  );

  await booking.save();
  await aviationPayment.save();

  pdfPath = getBaseUrl(req) + pdfPath?.split("public")[1];

  await sendMail({
    to: booking?.contact?.email,
    subject: `Your Check-in for Flight Booking is Done Against ${bookingAviationPayment?.PNR} ✈️`,
    html: boardingPassMailTemplate(pdfPath),
  });
}

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

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

const createBoardingPass = async (
  booking,
  payablePassengers,
  PNR,
  paymentId
) => {
  let boardingPasses = [];
  for (const passenger of payablePassengers) {
    let idx = 0;
    for (const [segmentKey, seat] of passenger?.seats?.entries() || {}) {
      const segment = booking?.flightDetail?.segments[idx];
      const airline = booking?.flightDetail?.airline;
      const barcodeText = buildBarcodePayload({
        PNR: PNR,
        flightNumber: segment?.flightNumber,
        seatNumber: seat?.seatNumber,
        departureTime: segment?.departureTime,
        departureAirport: segment?.departureAirport,
        arrivalAirport: segment?.arrivalAirport,
        passengerId: passenger?.id,
      });
      const qrCodeBase64 = await generateQRCode(barcodeText);

      const connectingAirports = booking?.connectingAirports;
      const departureAirportObj = connectingAirports?.find(
        (a) => a?.iata === segment?.departureAirport
      );
      const arrivalAirportObj = connectingAirports?.find(
        (a) => a?.iata === segment?.arrivalAirport
      );

      const boardingPass = await BoardingPassModel.create({
        bookingId: booking._id,
        airlineCode: airline?.code,
        airlineName: airline?.name,
        passengerId: passenger.id,
        PNR: PNR,
        segmentKey: segmentKey,

        flightNumber: segment?.flightNumber,
        arrivalAirport: segment?.arrivalAirport,
        arrivalCity: arrivalAirportObj?.city,
        arrivalTerminal: segment?.arrivalTerminal,
        arrivalTime: segment?.arrivalTime,
        carrierCode: segment?.carrierCode,
        class: segment?.class,
        departureAirport: segment?.departureAirport,
        departureCity: departureAirportObj?.city,
        departureTerminal: segment?.departureTerminal,
        departureTime: segment?.departureTime,
        duration: segment?.duration,

        passengerName: `${passenger.firstName} ${passenger.lastName}`,
        seatNumber: seat?.seatNumber,
        cabin: seat?.cabin,

        barcodeData: qrCodeBase64,
        status: "ACTIVE",
      });
      boardingPasses.push(boardingPass);
      await boardingPass.save();
      idx++;
    }
  }

  const pdfPath = await generateBoardingPassPDF(boardingPasses, PNR, paymentId);

  return pdfPath;
};

export default apiRouter;
