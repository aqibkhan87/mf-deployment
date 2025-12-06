import axios from "axios";

export const createBooking = (payload) =>
  axios.post("/api/flights/bookings/create", payload);

export const createPaymentOrder = (bookingId) =>
  axios.post("/api/flights/bookings/create-payment-order", { bookingId });

export const verifyPayment = (payload) =>
  axios.post("/api/flights/bookings/verify-payment", payload);
