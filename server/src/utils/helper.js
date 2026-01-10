import puppeteer from "puppeteer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import {
  boardingPassGenerateTemplate,
  singleBoardingPassGenerateTemplate,
} from "./template.js";

export const calculateCartSummary = (cart) => {
  // Initialize totals
  let totalAmount = 0;
  let totalActual = 0;

  // Calculate totals from cart products
  cart?.products?.forEach(({ productDetail, quantity }) => {
    if (!productDetail) return;

    const actualPrice = Number(productDetail.actualPrice) || 0;

    // Calculate discounted price depending on your discount field format
    let discountedPrice = actualPrice;
    discountedPrice = Number(productDetail.discountedPrice);

    totalActual += actualPrice * quantity;
    totalAmount += productDetail.price * quantity;
  });

  cart.totalAmount = totalAmount.toFixed(2);
  cart.totalActual = totalActual.toFixed(2);
  cart.savedAmount = (totalActual - totalAmount).toFixed(2);

  return cart;
};

export const mergeProducts = (userProducts = [], guestProducts = []) => {
  const map = new Map();

  [...userProducts, ...guestProducts].forEach(item => {
    const key = item?.productDetail?.id.toString();

    if (!map.has(key)) {
      map.set(key, {
        productDetail: item.productDetail,
        quantity: item.quantity,
      });
    } else {
      map.get(key).quantity += item.quantity;
    }
  });

  return Array.from(map.values());
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const formatDuration = (duration) => {
  const hrs = duration.match(/(\d+)H/);
  const mins = duration.match(/(\d+)M/);
  return `${hrs ? hrs[1] + "h " : ""}${mins ? mins[1] + "m" : ""}`.trim();
};

export const subtractMinutesFromUTC = (utcDateString, minutes = 30) => {
  const date = new Date(utcDateString); // parses UTC correctly
  date.setMinutes(date.getMinutes() - minutes);
  return formatTime(date);
};

/**
 * Encode boarding pass data into a compact string
 * (industry-style, no JSON)
 */
export const buildBarcodePayload = ({
  PNR,
  flightNumber,
  seatNumber,
  departureAirport,
  arrivalAirport,
  departureTime,
  passengerId,
}) => {
  return [
    PNR,
    flightNumber,
    seatNumber || "NA",
    departureAirport,
    arrivalAirport,
    departureTime,
    passengerId,
  ].join("|");
};

/**
 * Generate QR image (base64)
 */
export const generateQRCode = async (payload) => {
  return QRCode.toDataURL(payload);
};

export const buildBoardingPassData = (booking, passenger) => {
  return {
    bookingId: booking._id,
    passengerId: passenger.id,
    PNR: booking.PNR,

    passengerName: `${passenger.title} ${passenger.firstName} ${passenger.lastName}`,
    flightNumber: booking.flightNumber,
    flightDate: booking.flightDate,

    from: booking.sourceAirport.iata,
    to: booking.destinationAirport.iata,

    seatNumber: passenger.seats?.seatNumber,
    cabin: passenger.seats?.cabin,

    gate: booking.gate || "TBD",
    terminal: booking.terminal || "TBD",
    boardingGroup: passenger.boardingGroup || "GENERAL",
  };
};

export async function generateBoardingPassPDF({
  boardingPasses,
  PNR,
  paymentId,
  bookingId,
  passengerId = "",
  segmentKey,
  type = "multi",
}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  let html = "";
  if (type === "multi")
    html = boardingPassGenerateTemplate(boardingPasses, PNR);
  else if (type === "single")
    html = singleBoardingPassGenerateTemplate(boardingPasses, PNR);

  await page.setContent(html, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "checkin");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  let pdfPath = "";
  if (type === "single") {
    pdfPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "checkin",
      `boardingpass_${bookingId}_${passengerId}_${segmentKey}.pdf`
    );
  } else {
    pdfPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "checkin",
      `boardingpass_${paymentId}.pdf`
    );
  }

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfPath;
}

export const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;
