import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function PassengerDetailsPage() {
    const history = useHistory();

    const selectedFlight = {
        "id": "FL-98213",
        "airline": {
            "code": "EK",
            "name": "Emirates",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg"
        },
        "flightNumber": "EK 501",
        "source": {
            "airportCode": "BOM",
            "airportName": "Mumbai Chhatrapati Shivaji Intl",
            "city": "Mumbai",
            "terminal": "2",
            "time": "2025-02-15T04:15:00Z"
        },
        "destination": {
            "airportCode": "DXB",
            "airportName": "Dubai International",
            "city": "Dubai",
            "terminal": "3",
            "time": "2025-02-15T06:05:00Z"
        },
        "duration": "2h 20m",
        "layovers": [],
        "aircraft": {
            "model": "Boeing 777-300ER",
            "registration": "A6-ENP",
            "seatMapType": "77W"
        },
        "segments": [
            {
                "segmentId": "SEG-1",
                "from": "BOM",
                "to": "DXB",
                "flightNumber": "EK 501",
                "aircraft": "Boeing 777-300ER",
                "departureTime": "2025-02-15T04:15:00Z",
                "arrivalTime": "2025-02-15T06:05:00Z",
                "duration": "2h 20m",
                "operatingAirline": "Emirates",
                "marketingAirline": "Emirates",
                "baggage": {
                    "checkIn": "25kg",
                    "cabin": "7kg"
                },
                "meals": "Included",
                "wifi": true
            }
        ],
        "fare": {
            "currency": "INR",
            "price": 17800,
            "baseFare": 14200,
            "taxes": 3600,
            "refundable": true,
            "cancellationFee": 2500,
            "dateChangeFee": 2000,
            "class": "Economy Flex"
        },
        "seatSelection": {
            "available": true,
            "chargeForExtraLegroom": 1100,
            "chargeForFrontRow": 900,
            "seatMapRef": "seatmap_77w_3_4_3"
        },
        "cabin": {
            "class": "Economy",
            "layout": "3-4-3",
            "totalSeats": 310
        },
        "amenities": {
            "inflightEntertainment": true,
            "usbCharging": true,
            "meal": "Veg/Non-Veg Options",
            "wifi": true
        }
    }


    // Number of travellers - ideally from previous screen
    const [adults, setAdults] = useState(2);
    const [infants, setInfants] = useState(1);

    // Passenger forms array
    const [passengers, setPassengers] = useState([
        { type: "adult", title: "Male", first: "", last: "", dob: "", age: "", open: true },
        { type: "adult", title: "Female", first: "", last: "", dob: "", age: "", open: false },
        { type: "infant", title: "Male", first: "", last: "", dob: "", age: "", taggedTo: 0, open: true },
    ]);

    const segment = selectedFlight?.segments?.[0];

    const toggleCard = (index) => {
        const updated = [...passengers];
        updated[index].open = !updated[index].open;
        setPassengers(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    const handleSubmit = () => {
        console.log("Final Passenger Data:", passengers);
        // TODO: send to backend → /api/bookings/create
        history.push("/addons");
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">

            {/* LEFT SIDE */}
            <div className="flex-1 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <button className="text-blue-600 text-sm" onClick={() => window.history.back()}>
                        ← Back to Search Results
                    </button>
                    <span className="text-gray-600 text-sm">Next: Add On</span>
                </div>

                {/* Route Label */}
                <div className="bg-white p-3 rounded-2xl shadow border flex justify-center items-center">
                    <div className="flex space-x-10 text-center">
                        <span className="font-semibold text-blue-700">{segment.departureAirport}</span>
                        <span>—</span>
                        <span className="font-semibold text-blue-700">{segment.arrivalAirport}</span>
                    </div>
                </div>

                <h1 className="text-2xl font-semibold">
                    Add your <span className="text-green-600">little one’s details</span> and get ready for take off !
                </h1>

                <p className="font-medium text-gray-700">Enter passenger details</p>

                {/* PASSENGER CARDS */}
                {passengers.map((p, i) => (
                    <div key={i} className="bg-white border rounded-2xl shadow-sm">

                        {/* Card Header */}
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleCard(i)}
                        >
                            <div>
                                <h3 className="font-semibold">
                                    {p.type === "adult" ? `Adult ${i + 1}` : `Infant ${i - adults + 1}`}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {p.type === "infant" ? `Attached to Adult ${p.taggedTo + 1}` : `Passenger ${i + 1}`}
                                </p>
                            </div>
                            <span className="text-xl">{p.open ? "▴" : "▾"}</span>
                        </div>

                        {/* Expandable Form */}
                        {p.open && (
                            <div className="border-t p-5 space-y-4 bg-gray-50 rounded-b-2xl">

                                {/* Gender */}
                                <div className="flex gap-6">
                                    {["Male", "Female"].map((g) => (
                                        <label key={g} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={p.title === g}
                                                onChange={() => handleChange(i, "title", g)}
                                            />
                                            {g}
                                        </label>
                                    ))}
                                </div>

                                {/* Names */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">First Name</label>
                                        <input
                                            type="text"
                                            value={p.first}
                                            onChange={(e) => handleChange(i, "first", e.target.value)}
                                            className="w-full p-3 border rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Last Name</label>
                                        <input
                                            type="text"
                                            value={p.last}
                                            onChange={(e) => handleChange(i, "last", e.target.value)}
                                            className="w-full p-3 border rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* DOB + Age */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={p.dob}
                                            onChange={(e) => handleChange(i, "dob", e.target.value)}
                                            className="w-full p-3 border rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Age</label>
                                        <input
                                            type="number"
                                            value={p.age}
                                            onChange={(e) => handleChange(i, "age", e.target.value)}
                                            className="w-full p-3 border rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Infant Tagging */}
                                {p.type === "infant" && (
                                    <div>
                                        <label className="text-sm font-medium block mb-2">Tagged To (Adult)</label>
                                        <div className="space-y-2">
                                            {passengers
                                                .filter((a) => a.type === "adult")
                                                .map((a, indexADULT) => (
                                                    <label className="flex items-center gap-2" key={indexADULT}>
                                                        <input
                                                            type="radio"
                                                            checked={p.taggedTo === indexADULT}
                                                            onChange={() => handleChange(i, "taggedTo", indexADULT)}
                                                        />
                                                        Adult {indexADULT + 1}
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                ))}

                {/* Infant Offer */}
                {infants > 0 && (
                    <div className="text-center text-green-600 font-semibold text-lg">
                        Wow! You added an infant at ₹1 and got ₹1750 off 🎉
                    </div>
                )}
            </div>

            {/* RIGHT SIDE - Summary */}
            <div className="w-full md:w-80 space-y-5">

                {/* Trip Summary */}
                <div className="bg-white p-6 shadow rounded-2xl border space-y-4">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Trip Summary</h2>
                        <a className="text-blue-600 text-sm cursor-pointer">Details →</a>
                    </div>

                    <div className="text-sm text-gray-600">
                        {adults} Adult, {infants} Infant
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border">
                        <p className="font-semibold">
                            {segment.departureAirport} → {segment.arrivalAirport}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                            {segment.departureTime} — {segment.arrivalTime}
                        </p>
                    </div>

                    <div className="pt-2 text-right">
                        <p className="text-xl font-semibold">₹ {selectedFlight.totalPrice}</p>
                    </div>
                </div>

                {/* Continue */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
