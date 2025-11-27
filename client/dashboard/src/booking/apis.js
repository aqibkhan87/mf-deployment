import axios from "axios";
const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export const fetchAirports = (q) =>
  axios
    .get(`${BASE}/api/flights/airports`)
    .then((r) => r.data);

export const searchAirports = (q) =>
  axios
    .get(`${BASE}/api/flights/airports/search?q=${encodeURIComponent(q)}`)
    .then((r) => r.data);

export const searchFlights = ({ from, to, date, promo }) =>
  axios
    .get(`${BASE}/api/flights/search`, { params: { from, to, date, promo } })
    .then((r) => r.data);

export const getOffers = () =>
  axios.get(`${BASE}/api/flights/offers`).then((r) => r.data);

export const createBooking = (payload) =>
  axios.post(`${BASE}/api/flights/bookings`, payload).then((r) => r.data);
