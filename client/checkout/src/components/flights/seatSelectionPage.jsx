import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, Grid, Chip, Link, Button, Paper } from "@mui/material";
import { useHistory } from "react-router-dom"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ExitGap from "../../common/flights/seatSelection/exitGap.jsx";
import SeatBlock from "../../common/flights/seatSelection/seatBlock.jsx";
import PlaneNose from "../../assets/plane-nose.png";
import { useBookingStore } from "store/bookingStore";
import { getBookingDetails, updateSeatSelectionInBooking } from "../../apis/flights/booking.js";
import { getSeatMaps } from "../../apis/flights/seatMap.js";
import TripSummary from "../../common/flights/tripSummary.jsx";
import { createOrder, verifyPayment } from "../../apis/payment.js";
import { loadRazorpay } from "../../utils/loadRazorpay.js";

const LegendItem = ({ color, label }) => (
    <Box display="flex" alignItems="center" gap={1.5}>
        <Box
            sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                backgroundColor: color,
                border: "1px solid rgba(0,0,0,0.15)",
            }}
        />
        <Typography fontSize={14}>{label}</Typography>
    </Box>
);

function SeatSelection() {
    const itineraryKey = useRef(null);
    const history = useHistory();
    const { bookingDetails, seatMaps } = useBookingStore();
    const [seatStatusBySegment, setSeatStatusBySegment] = useState({});
    const [flightPassengers, setFlightPassengers] = useState([]);
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const [seatPricing, setSeatPricing] = useState(0);
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
    const activeSeatMap = seatMaps?.[activeSegmentIndex];
    const ECONONMY_SEAT_MAP = seatMaps?.[activeSegmentIndex]?.seatLayout?.find(layout => layout.cabin === "ECONOMY") || {};
    const BUSINESS_SEAT_MAP = seatMaps?.[activeSegmentIndex]?.seatLayout?.find(layout => layout.cabin === "BUSINESS") || {};
    const segments = bookingDetails?.flightDetail?.segments || [];

    const flightKey = activeSeatMap?.flightInstanceKey;
    const seatStatusMap = seatStatusBySegment?.[flightKey] || {};

    useEffect(() => {
        if (!activeSeatMap) return;
        let updatedSeatStatus = {
            BUSINESS: {
                ...activeSeatMap.seatStatus.BUSINESS
            },
            ECONOMY: {
                ...activeSeatMap.seatStatus.ECONOMY
            }
        };
        flightPassengers.forEach((passenger) => {
            const seatNumber = passenger?.seats?.[flightKey]?.seatNumber;
            const cabin = passenger?.seats?.[flightKey]?.cabin;
            if (seatNumber) {
                updatedSeatStatus[cabin][seatNumber] = "selected";
            }
        });
        setSeatStatusBySegment(prev => ({
            ...prev,
            [activeSeatMap.flightInstanceKey]:
                prev[activeSeatMap.flightInstanceKey] || updatedSeatStatus
        }));
    }, [activeSeatMap]);

    useEffect(() => {
        if (bookingDetails) {
            fetchSeatMaps();
            if (bookingDetails?.passengers) {
                setFlightPassengers(bookingDetails?.passengers || [])
                if (bookingDetails?.passengers?.length) {
                    let seatPrices = 0;
                    bookingDetails?.passengers?.forEach((p) => {
                        if(p?.isAdult && p?.seats && Object.values(p?.seats)) {
                            for (let [key, value] of Object.entries(p?.seats)) {
                                if (p?.seats?.[key]) {
                                    const seatPrice = value?.price || 0;
                                    seatPrices += Number(seatPrice);
                                }
                            }
                        }
                    });
                    setSeatPricing(seatPrices);
                }
            };
        }
    }, [bookingDetails])

    useEffect(() => {
        fetchBooking();
    }, [])

    const fetchBooking = async () => {
        await getBookingDetails();
    }

    const fetchSeatMaps = async () => {
        const segments = bookingDetails?.flightDetail?.segments || [];
        itineraryKey.current = segments
            ?.map(seg =>
                `${seg?.carrierCode}-${seg?.flightNumber}-${seg?.departureTime?.split(".")[0]}`
            )
            ?.join("_");
        await getSeatMaps(itineraryKey.current);
    }

    const handleSeatSelect = (seatId, seatLayoutType, seatTypeWithPrice) => {
        if (seatStatusMap?.[seatLayoutType]?.[seatId] === "reserved") return;

        const currentPassenger = adultPassengers[activePassengerIndex];
        if (!currentPassenger) return;

        // Prevent selecting more seats than adults
        const alreadySelectedSeats = adultPassengers.filter(
            p => p?.seats?.[flightKey]?.seatNumber
        ).length;
        if (!currentPassenger?.seats?.[flightKey]?.seatNumber && alreadySelectedSeats >= adultPassengers.length) {
            return;
        }

        setFlightPassengers(prev => {
            const updated = [...prev];

            const passengerIndex = updated.findIndex(
                p => p === currentPassenger
            );

            const oldSeat = updated[passengerIndex]?.seats?.[flightKey];

            /* ---------------------------------
            CASE 1: Clicking same seat → DESELECT
            ---------------------------------- */
            if (oldSeat?.seatNumber === seatId) {
                setSeatStatusBySegment(prev => ({
                    ...prev,
                    [flightKey]: {
                        ...prev[flightKey],
                        [oldSeat.cabin]: {
                            ...prev[flightKey][oldSeat.cabin],
                            [oldSeat.seatNumber]: "available",
                        }
                    }
                }));
                setSeatPricing((prev) => prev - oldSeat?.price);
                updated[passengerIndex] = {
                    ...updated[passengerIndex],
                    seats: {
                        ...(updated[passengerIndex].seats || {}),
                        [flightKey]: null
                    }
                };

                return updated;
            }

            /* ---------------------------------
            CASE 2: Seat taken by another passenger → block
            ---------------------------------- */

            const isSeatTaken = updated.some(
                (p, idx) => idx !== passengerIndex && p?.seats?.[flightKey]?.seatNumber === seatId
            );

            if (isSeatTaken) return prev;


            /* ---------------------------------
               CASE 3: Passenger already has seat → free it
            ---------------------------------- */
            if (oldSeat) {
                setSeatStatusBySegment(prev => ({
                    ...prev,
                    [flightKey]: {
                        ...prev[flightKey],
                        [oldSeat.cabin]: {
                            ...prev[flightKey][oldSeat.cabin],
                            [oldSeat.seatNumber]: "available",
                        }
                    }
                }));
                setSeatPricing((prev) => prev - oldSeat?.price)
            }

            /* ---------------------------------
               ASSIGN NEW SEAT
            ---------------------------------- */
            updated[passengerIndex] = {
                ...updated[passengerIndex],
                seats: {
                    ...(updated[passengerIndex].seats || {}),
                    [flightKey]: {
                        ...seatTypeWithPrice,
                        seatNumber: seatId,
                        cabin: seatLayoutType,
                    }
                }
            };

            setSeatStatusBySegment(prev => ({
                ...prev,
                [flightKey]: {
                    ...prev[flightKey],
                    [seatLayoutType]: {
                        ...prev[flightKey]?.[seatLayoutType],
                        [seatId]: "selected",
                    }
                }
            }));
            setSeatPricing((prev) => prev + seatTypeWithPrice?.price)

//             if (activeSegmentIndex === 1) setActiveSegmentIndex(0)
//             if (segments?.length > 1) setActiveSegmentIndex(prev => prev + 1)

// console.log("seatStatusBySegment", seatStatusBySegment)
            // Move to next passenger
            setActivePassengerIndex(prevIdx => {
                let currentInd = prevIdx;
                if(currentInd === adultPassengers?.length - 1) {
                    if (segments?.length > 1) {
                        debugger
                        setActiveSegmentIndex(prev => segments?.length - 1 >= prev + 1 ? prev + 1 : prev)
                        return 0;
                    }
                }
                return currentInd < adultPassengers.length - 1 ? currentInd + 1 : currentInd
            }
            );

            return updated;
        });
    };

    const handlePayment = async () => {
        const response = await updateSeatSelectionInBooking({
            bookingId: bookingDetails?.bookingId,
            itineraryKey: itineraryKey?.current,
            passengers: adultPassengers,
        });
        if (response?.success) {
            proceedToPayment();
        }
    }

    const proceedToPayment = async () => {
        // 1️⃣ Create Order
        const data = await createOrder({
            type: "FLIGHT", // or ECOMMERCE
            entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
        });

        // 2️⃣ Load Razorpay
        const loaded = await loadRazorpay();
        if (!loaded) {
            alert("Payment SDK failed. Try again.");
            return;
        }
        // 3️⃣ Payment Options
        const options = {
            key: process.env.RAZORPAY_KEY_ID,
            order_id: data.orderId,
            amount: data.amount,
            currency: "INR",

            handler: async (res) => {
                try {
                    const response = await verifyPayment({
                        type: "FLIGHT",
                        entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
                        ...res,
                    });
                    const { orderId, status, PNR } = response;

                    if (response?.success) {
                        localStorage.setItem("bookingId", "");
                        localStorage.setItem("search-info", "{}");
                        sessionStorage.setItem("selectedFlight", "{}");
                        history.push(`/itinerary?orderId=${orderId}&status=${status}&PNR=${PNR}`);
                    }
                } catch (err) {
                    alert("Payment verification failed");
                    console.log("err: Payment verification failed", err)
                }
            },

            modal: {
                ondismiss: async () => {
                    alert("Payment cancelled");
                },
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", async (err) => {
            alert("Payment failed", err);
        });

        rzp.open();
    }

    const adultPassengers = useMemo(
        () => flightPassengers?.filter(p => p.isAdult),
        [flightPassengers]
    );

    const priceBreakdownDetails = useMemo(() => {
        return {
            ...bookingDetails?.priceBreakdown,
            seatsPrice: seatPricing,
            totalPrice: bookingDetails?.priceBreakdown?.totalPrice + seatPricing,
        }
    }, [bookingDetails, seatPricing]);

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Box >
                        <Link href="/addons" sx={{
                            cursor: "pointer",
                            color: "#000",
                            textDecorationColor: "#000",
                            textUnderlineOffset: "4px",
                            "&:hover": {
                                textDecorationColor: "#000",
                            },
                        }}>
                            <KeyboardBackspaceIcon /> Back To Addons
                        </Link>
                    </Box>
                    {/* <Paper sx={{ my: 4, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
                        <Typography align="center" fontWeight="bold">
                            {sourceAirport?.city} to {destinationAirport?.city}
                        </Typography>
                    </Paper> */}
                    <Box display="flex" gap={2} mb={2} sx={{ mt: 4, py: 2 }}>
                        {seatMaps?.map((seg, idx) => {
                            const segment = segments[idx]
                            return (
                                <Chip
                                    key={idx}
                                    label={`${segment?.departureAirport} - ${segment?.arrivalAirport}`}
                                    color={idx === activeSegmentIndex ? "primary" : "default"}
                                    onClick={() => setActiveSegmentIndex(idx)}
                                    sx={{ width: `${Math.floor(100 / segments?.length)}%`, p: 2 }}
                                />
                            )
                        })}
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography>Passengers</Typography>
                    </Box>
                    <Box sx={{ my: 2, gap: 2, display: "flex", flexWrap: "wrap" }}>
                        {adultPassengers?.map((passenger, index) => {
                            const isActive = index === activePassengerIndex;
                            return (
                                <Box key={index} variant="outlined" sx={{
                                    mb: 2,
                                    boxShadow: isActive
                                        ? "0 6px 16px rgba(25,118,210,0.25)"
                                        : "0 2px 6px rgba(0,0,0,0.08)",
                                    border: isActive ? "2px solid #d0e5ff" : "1px solid #e0e0e0",
                                    background: isActive ? "#EEF7FF" : "#fff",
                                    borderRadius: "10px",
                                    padding: 1,
                                    color: "#000",
                                    width: 200,
                                    minHeight: 100
                                }}
                                    onClick={() => setActivePassengerIndex(index)}
                                >
                                    <Typography variant="h6">
                                        {passenger?.firstName} {passenger?.lastName}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        {passenger?.seats?.[flightKey] ? (
                                            <Chip
                                                label={passenger?.seats?.[flightKey]?.seatNumber}
                                                sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2, mt: 1 }} />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No Seat Selected
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            {passenger?.seats?.[flightKey]?.price ? `₹ ${passenger?.seats?.[flightKey]?.price}` : ""}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>

                    {seatStatusMap?.ECONOMY && seatStatusMap?.BUSINESS && <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 3,
                                p: 2,
                            }}
                        >
                            <Typography fontWeight={600} mb={1}>
                                Seat Types
                            </Typography>

                            <Box display="flex" gap={1.5}>
                                <LegendItem color="#ffffff" label="Available" />
                                <LegendItem color="#cfe9ff" label="Selected" />
                                <LegendItem color="#ffd6d6" label="Reserved" />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                overflow: "hidden",
                                position: "relative",
                                minHeight: 350,
                                display: "flex",
                                overflowX: "auto",
                                overflowY: "hidden",
                                /* Firefox */
                                scrollbarWidth: "none",
                                /* IE / Edge */
                                msOverflowStyle: "none",
                                /* Chrome / Safari */
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={PlaneNose}
                                alt="Plane Nose"
                                sx={{
                                    minWidth: 300,
                                    minHeight: 300,
                                    mr: -6,
                                    zIndex: 2,
                                }}
                            />
                            <Box display="flex" alignItems="center"
                                style={{
                                    paddingLeft: 60,
                                    paddingRight: 30,
                                    minHeight: 300,
                                    borderBottomRightRadius: 10,
                                    borderTopRightRadius: 10,
                                    backgroundColor: "#eef7ff",
                                }}
                            >
                                <Box display="flex" sx={{ paddingTop: 1, paddingBottom: 1, }}>
                                    <SeatBlock
                                        layout={BUSINESS_SEAT_MAP}
                                        seatState={seatStatusMap["BUSINESS"]}
                                        onSelect={handleSeatSelect}
                                        seatLayoutType="BUSINESS"
                                        seatPricing={activeSeatMap?.seatLayout?.find(l => l.cabin === "BUSINESS")?.seatPricing}
                                        activePassenger={adultPassengers[activePassengerIndex]}
                                        flightKey={flightKey}
                                    />
                                    <ExitGap />
                                    <SeatBlock
                                        layout={ECONONMY_SEAT_MAP}
                                        seatState={seatStatusMap["ECONOMY"]}
                                        onSelect={handleSeatSelect}
                                        seatLayoutType="ECONOMY"
                                        seatPricing={activeSeatMap?.seatLayout?.find(l => l.cabin === "ECONOMY")?.seatPricing}
                                        activePassenger={adultPassengers[activePassengerIndex]}
                                        flightKey={flightKey}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>}
                </Grid>
                {/* RIGHT SUMMARY */}
                <Grid item xs={12} md={4}>
                    <TripSummary priceBreakdown={priceBreakdownDetails} />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handlePayment}>
                        Proceed to Payment
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SeatSelection;
