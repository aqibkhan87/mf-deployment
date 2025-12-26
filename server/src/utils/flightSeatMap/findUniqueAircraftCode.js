import FlightPriceModel from "../../models/flights/flightPrice.js";

export const findAllUniqueAircraftCode = async () => {
   const flightData = await FlightPriceModel.find({});
   const uniqueAircraftCode = new Set();
   flightData?.map((flight) => {
    flight?.fares?.map((fare) => {
        fare?.segments?.map((seg) => {
            uniqueAircraftCode.add(seg?.aircraftCode);
        })
    })
   })
   console.log("uniqueAircraftCode", [...uniqueAircraftCode])
   return uniqueAircraftCode;
}