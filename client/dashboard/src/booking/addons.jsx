// pages/AddonsPage.jsx
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useBookingStore } from "store/bookingStore"; 

// data for options
const MEALS = [
    { id: "m-veg", title: "6E Eats (Veg)", desc: "Choice of the day + Beverage", price: 400, tag: "Veg" },
    { id: "m-nv", title: "6E Eats (Non-Veg)", desc: "Chicken Junglee Sandwich + Beverage", price: 500, tag: "Non Veg" },
];

const BAGGAGE_DOMESTIC = [
    { id: "bag-0", label: "No excess baggage", price: 0 },
    { id: "bag-3", label: "3 Kg", price: 1950, oldPrice: 2100 },
    { id: "bag-5", label: "5 Kg", price: 3150, oldPrice: 3500 },
    { id: "bag-10", label: "10 Kg", price: 5200, oldPrice: 7000 },
    { id: "bag-15", label: "15 Kg", price: 7750, oldPrice: 10500 },
];

const BAGGAGE_INTL = [
    { id: "int-8", label: "8 Kg", price: 1600 },
    { id: "int-15", label: "15 Kg", price: 3000 },
    { id: "int-30", label: "30 Kg", price: 6000 },
];

const EXTRAS = [
    { id: "extra-piece", title: "Additional Piece", desc: "Add extra baggage to your booking", price: 2500 },
    { id: "sports", title: "Sports Equipment", desc: "Add now to avoid hassle later", price: 1800 },
];

const mockFlight = {
  id: "FL-98213",
  airline: { code: "6E", name: "IndiGo", logo: "https://content.airhex.com/content/logos/airlines_6E_200_200_r.png" },
  segments: [
    {
      from: "DEL",
      to: "BOM",
      departureTime: "2025-12-10T09:00:00Z",
      arrivalTime: "2025-12-10T11:25:00Z",
      duration: "PT2H25M",
      aircraft: "A320",
    },
  ],
  fare: { currency: "INR", price: 28534, baseFare: 25000 },
};
const mockPassengers = [
  { id: "p1", type: "adult", name: "Aqib Khan" },
  { id: "p2", type: "adult", name: "Passenger 2" },
  { id: "p3", type: "infant", name: "Infant 1" },
];


function PassengerAccordion({ passenger }) {
    const toggleMeal = useBookingStore((s) => s.toggleMeal);
    const setBaggage = useBookingStore((s) => s.setBaggage);
    const toggleExtra = useBookingStore((s) => s.toggleExtra);
    const selectedAddons = useBookingStore((s) => s.selectedAddons)[passenger.id] || { meals: [], baggage: null, extras: [] };

    const mealSelectedIds = (selectedAddons.meals || []).map((m) => m.id);
    const extraIds = (selectedAddons.extras || []).map((e) => e.id);
    const history = useHistory();

    return (
        <div className="bg-white rounded-2xl shadow p-4 border">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <div className="font-semibold">{passenger.name}</div>
                    <div className="text-xs text-gray-500">{passenger.type === "infant" ? "Infant" : "Adult"}</div>
                </div>
            </div>

            {/* Meals */}
            <div className="space-y-3">
                <div className="text-lg font-semibold">6E Eats (Complimentary Beverage With Every Snack)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {MEALS.map((m) => (
                        <div className="border rounded-xl p-3 flex justify-between items-center" key={m.id}>
                            <div>
                                <div className="text-sm font-semibold">{m.title} <span className="ml-2 text-xs px-2 py-1 bg-green-100 rounded">{m.tag}</span></div>
                                <div className="text-xs text-gray-500">{m.desc}</div>
                                <div className="mt-2 font-semibold">₹{m.price}</div>
                            </div>
                            <div>
                                <button
                                    onClick={() => toggleMeal(passenger.id, m)}
                                    className={`px-4 py-2 rounded-full ${mealSelectedIds.includes(m.id) ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"}`}
                                >
                                    {mealSelectedIds.includes(m.id) ? "Added" : "Add"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Baggage */}
            <div className="mt-6">
                <div className="text-lg font-semibold mb-2">Baggage <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">Sale</span></div>
                <div className="text-sm text-gray-600 mb-3">Domestic</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BAGGAGE_DOMESTIC.map((b) => {
                        const selected = selectedAddons.baggage?.id === b.id;
                        return (
                            <label key={b.id} className={`border rounded-xl p-3 cursor-pointer ${selected ? "ring-2 ring-blue-300" : ""}`}>
                                <input
                                    type="radio"
                                    name={`baggage-${passenger.id}`}
                                    checked={selected}
                                    onChange={() => setBaggage(passenger.id, b)}
                                    className="hidden"
                                />
                                <div className="text-sm font-medium">{b.label}</div>
                                <div className="text-xs text-gray-500">₹{b.price}{b.oldPrice && <span className="line-through ml-2 text-gray-300">₹{b.oldPrice}</span>}</div>
                            </label>
                        );
                    })}
                </div>

                <div className="text-sm text-gray-600 mt-4 mb-2">International baggage</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BAGGAGE_INTL.map((b) => {
                        const selected = selectedAddons.baggage?.id === b.id;
                        return (
                            <label key={b.id} className={`border rounded-xl p-3 cursor-pointer ${selected ? "ring-2 ring-blue-300" : ""}`}>
                                <input
                                    type="radio"
                                    name={`baggage-int-${passenger.id}`}
                                    checked={selected}
                                    onChange={() => setBaggage(passenger.id, b)}
                                    className="hidden"
                                />
                                <div className="text-sm font-medium">{b.label}</div>
                                <div className="text-xs text-gray-500">₹{b.price}</div>
                            </label>
                        );
                    })}
                </div>

                {/* Extras */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXTRAS.map((ex) => {
                        const selected = extraIds.includes(ex.id);
                        return (
                            <div key={ex.id} className="border rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{ex.title}</div>
                                    <div className="text-xs text-gray-500">{ex.desc}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">₹{ex.price}</div>
                                    <button onClick={() => toggleExtra(passenger.id, ex)} className={`mt-2 px-4 py-2 rounded-full ${selected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"}`}>
                                        {selected ? "Added" : "Add"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function AddonsPage() {
    const init = useBookingStore((s) => s.init);
    const selectedFlight = useBookingStore((s) => s.selectedFlight);
    const passengers = useBookingStore((s) => s.passengers);
    const getTotal = useBookingStore((s) => s.getTotalAddonsPrice);
    const history = useHistory();

    useEffect(() => {
        // init mock in store
        init({ flight: mockFlight, passengers: mockPassengers });
    }, [init]);

    if (!selectedFlight) return <div className="p-6">Loading…</div>;

    const totals = getTotal();

    return (
        <div className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: add-ons list (full width on mobile) */}
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-semibold">Select add-ons for all passengers</h1>

                {passengers.map((p) => (
                    <div key={p.id} className="mb-4">
                        <PassengerAccordion passenger={p} />
                    </div>
                ))}

                {/* bottom CTA */}
                <div className="fixed left-0 right-0 bottom-4 lg:static lg:mt-6">
                    <div className="max-w-6xl mx-auto lg:flex lg:justify-end">
                        <div className="bg-white rounded-full shadow px-6 py-3 flex items-center justify-between md:justify-end gap-6 border">
                            <div className="text-sm text-gray-600">Total Add-ons: <span className="font-semibold">₹{totals.addons}</span></div>
                            <div className="text-sm">Base Fare: <span className="font-semibold">₹{totals.baseFare}</span></div>
                            <div className="text-lg font-semibold">Total: ₹{totals.total}</div>
                            <button className="bg-blue-600 text-white px-5 py-2 rounded-full">Proceed</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: trip summary */}
            <aside className="bg-white rounded-2xl shadow p-6 border">
                <h2 className="text-xl font-semibold">Trip Summary</h2>
                <div className="text-sm text-gray-500 mt-2">Flight</div>
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border">
                    <div className="flex items-center gap-3">
                        <img src={selectedFlight.airline.logo} alt={selectedFlight.airline.name} className="w-10 h-10 object-contain" />
                        <div>
                            <div className="font-semibold">{selectedFlight.airline.name}</div>
                            <div className="text-xs text-gray-500">Flight: {selectedFlight.id}</div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="font-semibold">{selectedFlight.segments[0].from} → {selectedFlight.segments[0].to}</div>
                        <div className="text-xs text-gray-500">{new Date(selectedFlight.segments[0].departureTime).toLocaleString()} — {new Date(selectedFlight.segments[0].arrivalTime).toLocaleString()}</div>
                        <div className="mt-2 text-sm">Duration: {selectedFlight.segments[0].duration}</div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                        <div>Fare</div>
                        <div>₹{totals.baseFare}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <div>Add-ons</div>
                        <div>₹{totals.addons}</div>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-semibold text-lg">
                        <div>Total</div>
                        <div>₹{totals.total}</div>
                    </div>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl">Continue to Payment</button>
            </aside>
        </div>
    );
}
