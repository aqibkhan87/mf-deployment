import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { useBookingStore } from "store/bookingStore";
import { searchFlights } from "../apis/flights/booking";

// Helper to convert ISO time to HH:MM
const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Helper to convert duration like PT2H25M → 2h 25m
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
    const [loading, setLoading] = useState(false);
    const formattedDate = new Date(date).toLocaleDateString();

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
        try {
            setLoading(true);
            await searchFlights(searchData);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
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
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow p-4 border">
                <h1 className="text-2xl font-semibold">Flights from {from} → {to}</h1>
                <p className="text-gray-600">{formattedDate}</p>
                <p className="mt-2 text-gray-800 font-medium">{selectedFlight?.fares?.length || 0} flights found</p>
            </div>

            {/* Flight List */}
            <div className="space-y-4">
                {selectedFlight?.fares?.map((fare) => (
                    <div
                        key={fare.providerOfferId}
                        className="bg-white rounded-2xl shadow border p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
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
                                    <div className="text-sm text-gray-500">{fare.airline.country} • {fare.airline.alliance}</div>
                                </div>
                            </div>

                            {/* Flight Segments */}
                            {fare.segments.map((segment, index) => (
                                <div key={index} className="flex items-center space-x-6">
                                    <div>
                                        <p className="text-xl font-bold">{formatTime(segment.departureTime)}</p>
                                        <p className="text-gray-500">{segment.departureAirport}</p>
                                    </div>
                                    <div className="text-gray-500">→</div>
                                    <div>
                                        <p className="text-xl font-bold">{formatTime(segment.arrivalTime)}</p>
                                        <p className="text-gray-500">{segment.arrivalAirport}</p>
                                    </div>
                                    <p className="ml-4 text-gray-600">{formatDuration(segment.duration)}</p>
                                </div>
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
                            <p className="text-2xl font-semibold">₹ {fare.totalPrice}</p>
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
        </div>

    );
}

export default FlightResults;