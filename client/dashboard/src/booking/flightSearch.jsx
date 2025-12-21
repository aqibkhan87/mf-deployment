import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useBookingStore } from "store/bookingStore";
import { searchFlights } from "../apis/flights/booking";
import "./flightSearch.scss"

const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (duration) => {
    const hrs = duration.match(/(\d+)H/);
    const mins = duration.match(/(\d+)M/);
    return `${hrs ? hrs[1] + "h " : ""}${mins ? mins[1] + "m" : ""}`.trim();
};

function FlightResults() {
    const { selectedFlight } = useBookingStore();
    const history = useHistory();
    const searchInfo = localStorage.getItem("search-info") ? JSON.parse(localStorage.getItem("search-info")) : "";
    const from = searchInfo.from;
    const to = searchInfo.to;
    const date = searchInfo.date;
    const passengers = searchInfo.passengers;
    const sourceAirport = selectedFlight?.sourceAirport;
    const destinationAirport = selectedFlight?.destinationAirport;

    useEffect(() => {
        getSearchFlights();
    }, []);

    const getSearchFlights = async () => {
        let searchData = {
            from: from,
            to: to,
            date: date,
            passengers: passengers
        };
        await searchFlights(searchData);
    }


    const handleFlightSearch = async (e, flight) => {
        e?.preventDefault();
        const payload = {
            flightId: selectedFlight._id,
            providerId: flight.providerOfferId,
            from,
            to,
            departDate: date,
            passengers,
        };

        sessionStorage.setItem(
            "selectedFlight",
            JSON.stringify(payload)
        );
        history.push(`/passenger-edit`)
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6 flight-search">
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                breakpoints={{
                    1024: { slidesPerView: 8 },
                    768: { slidesPerView: 5 },
                    480: { slidesPerView: 3 },
                }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((p, i) => (
                    <SwiperSlide className="cursor-pointer">
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography variant="body1" gutterBottom>
                                    7, Dec
                                </Typography>
                                <Typography variant="h6" color="green">
                                    ₹ 10,000
                                </Typography>
                            </CardContent>
                        </Card>
                    </SwiperSlide>
                ))}

            </Swiper>
            {/* Header */}
            <div className="shadow p-4 border text-center" style={{ backgroundColor: "#1976d2", borderRadius: 100 }}>
                <h1 className="text-2xl font-semibold text-white">
                    Flights from {sourceAirport?.city} to {destinationAirport?.city}
                </h1>
            </div>
            <Box>
                <p className="mt-2 text-gray-800 font-medium">
                    {selectedFlight?.fares?.length || 0} Flights Found
                </p>
            </Box>
            {/* Flight List */}
            <div className="space-y-4">
                {selectedFlight?.fares?.map((fare) => (
                    <div
                        key={fare.providerOfferId}
                        className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
                        style={{ borderColor: "#f7fbff", borderRadius: 2 }}
                    >
                        {/* Left Section */}
                        <div className="flex flex-col space-y-3 w-full md:w-2/3">
                            {/* Airline Info */}
                            <div className="flex items-center space-x-3">
                                <img
                                    src={fare.airline.logo}
                                    alt={fare.airline.name}
                                    className="w-10 h-10 object-contain rounded"
                                />
                                <div className="flex flex-col">
                                    <div className="text-lg font-semibold">{fare.airline.name} ({fare.airline.code})</div>
                                </div>
                            </div>

                            {/* Flight Segments */}
                            {fare.segments.map((segment, index) => (
                                <Box key={index} className="flex items-center space-x-6 justify-between">
                                    <Box>
                                        <p className="text-xl font-bold">{formatTime(segment.departureTime)}</p>
                                        <p className="text-gray-500">{sourceAirport?.city}, {segment.departureAirport}</p>
                                    </Box>
                                    <Box className="text-gray-500">
                                        <p className="text-gray-600">{formatDuration(segment.duration)}</p>
                                        <p style={{ width: 60, height: 5, borderRadius: 8, backgroundColor: "#1976d2" }}></p>
                                    </Box>
                                    <Box>
                                        <p className="text-xl font-bold">{formatTime(segment.arrivalTime)}</p>
                                        <p className="text-gray-500">{destinationAirport?.city}, {segment.arrivalAirport}</p>
                                    </Box>

                                </Box>
                            ))}

                            {/* Aircraft & Cabin Info */}
                            <div className="text-gray-600 text-sm">
                                {fare.segments.map((seg, idx) => (
                                    <span key={idx}>
                                        Aircraft: {seg.aircraftCode} • Cabin: {seg.cabin} • Class: {seg.class}
                                        {idx < fare.segments.length - 1 && " | "}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Price & Button */}
                        <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                            <Box className="flex text-lg font-semibold items-center">
                                ₹ {Math.floor(fare.totalPrice)}
                                <Typography className="text-sm"> / adult</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                className="mt-2 px-5 py-2 transition"
                                onClick={(e) => handleFlightSearch(e, fare)}
                            >
                                Select Flight
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {!selectedFlight?.fares?.length && <div>
                No Flight Found
            </div>}
        </div>

    );
}

export default FlightResults;