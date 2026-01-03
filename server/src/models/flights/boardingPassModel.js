import mongoose from "mongoose";

const BoardingPassSchema = new mongoose.Schema(
  {
    bookingId: String,
    airlineCode: String,
    airlineName: String,
    passengerId: String,
    PNR: String,
    segmentKey: String,
    flightNumber: String,

    arrivalAirport: String,
    arrivalCity: String,
    arrivalTerminal: String,
    arrivalTime: String,
    carrierCode: String,
    class: String,
    departureAirport: String,
    departureCity: String,
    departureTerminal: String,
    departureTime: String,
    duration: String,

    passengerName: String,
    seatNumber: String,
    cabin: String,
    barcodeData: String,
    status: String,
    pdfURL: String,
  },
  { timestamps: true, collection: "boardingPass" }
);

const BoardingPassModel = mongoose.model("boardingPass", BoardingPassSchema);

export default BoardingPassModel;
