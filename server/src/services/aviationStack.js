import axios from "axios";

const API_KEY = process.env.AVIATIONSTACK_API_KEY;
const BASE_URL = "http://api.aviationstack.com/v1/flights";

export async function fetchAllFlightsForDate(date) {
  let allFlights = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await axios.get(BASE_URL, {
      params: {
        access_key: API_KEY,
        flight_date: date,
        limit,
        offset,
      },
    });

    const flights = response.data.data || [];
    if (flights.length === 0) break;

    allFlights = allFlights.concat(flights);
    offset += limit;

    const pagination = response.data.pagination;
    if (!pagination || offset >= pagination.total) break;
  }

  console.log(`Fetched ${allFlights.length} flights for ${date}`);
  return allFlights;
}
