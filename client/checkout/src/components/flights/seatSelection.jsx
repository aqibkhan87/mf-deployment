import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, Grid, Chip, Link, Button, Paper } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ExitGap from "../../common/flights/seatSelection/exitGap";
import SeatBlock from "../../common/flights/seatSelection/seatBlock";
import PlaneNose from "../../assets/plane-nose.png";
import { useBookingStore } from "store/bookingStore";
import { getBookingDetails, updateSeatSelectionInBooking } from "../../apis/flights/booking";
import { getSeatMaps } from "../../apis/flights/seatMap";
import TripSummary from "./tripSummary";
import { createOrder, verifyPayment } from "../../apis/payment.js";

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
    const sourceAirport = bookingDetails?.sourceAirport;
    const destinationAirport = bookingDetails?.destinationAirport;

    const flightKey = activeSeatMap?.flightInstanceKey;
    const seatStatusMap = seatStatusBySegment?.[flightKey] || {};

    console.log("seatMapsseatMaps", seatMaps)

    useEffect(() => {
        if (!activeSeatMap) return;
        setSeatStatusBySegment(prev => ({
            ...prev,
            [activeSeatMap.flightInstanceKey]:
                prev[activeSeatMap.flightInstanceKey] || activeSeatMap.seatStatus
        }));
    }, [activeSeatMap]);

    useEffect(() => {
        if (bookingDetails) {
            fetchSeatMaps();
            if (bookingDetails?.passengers) {
                setFlightPassengers(bookingDetails?.passengers || [])
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
            .map(seg =>
                `${seg.carrierCode}-${seg.flightNumber}-${seg.departureTime}`
            )
            .join("_");
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

            // Move to next passenger
            setActivePassengerIndex(prevIdx =>
                prevIdx < adultPassengers.length - 1 ? prevIdx + 1 : prevIdx
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

        if (response?.status) {
            proceedToPayment();
        }

        // history.push("/flight/checkout");
    }

    const proceedToPayment = async () => {
        // 1️⃣ Create Order
        const data = await createOrder({
            type: "FLIGHT", // or ECOMMERCE
            entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
        });
        console.log("order data", data);

        // ✅ ZERO AMOUNT
        if (data?.skipPayment) {
            history.push("/dashboard");
            return;
        }

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
                    const verify = await verifyPayment({
                        type: "ECOMMERCE",
                        entityId,
                        ...res,
                    });

                    if (verify.success) {
                        navigate("/dashbaord");
                    }
                } catch {
                    alert("Payment verification failed");
                }
            },

            modal: {
                ondismiss: async () => {
                    alert("Payment cancelled");
                },
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", async () => {
            alert("Payment failed");
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
            finalPrice: bookingDetails?.priceBreakdown?.finalPrice + seatPricing,
        }
    }, [bookingDetails, seatPricing]);

    console.log("seatStatusMap seatStatusMap", seatStatusMap, adultPassengers)
    console.log("seatStatusBySegment ", seatStatusBySegment)

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
                    <Paper sx={{ my: 2, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
                        <Typography align="center" fontWeight="bold">
                            {sourceAirport?.city} to {destinationAirport?.city}
                        </Typography>
                    </Paper>
                    <Box sx={{ py: 2 }}>
                        <Typography>Passengers</Typography>
                    </Box>
                    <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
                        {adultPassengers?.map((passenger, index) => {
                            const isActive = index === activePassengerIndex;
                            return (
                                <Box key={index} variant="outlined" sx={{
                                    mb: 2,
                                    boxShadow: isActive
                                        ? "0 6px 16px rgba(25,118,210,0.25)"
                                        : "0 2px 6px rgba(0,0,0,0.08)",
                                    border: isActive ? "2px solid #d0e5ff" : "1px solid #e0e0e0",
                                    background: isActive ? "rgb(238, 247, 255)" : "#fff",
                                    borderRadius: "10px",
                                    padding: 1,
                                    color: "#000",
                                    width: 200
                                }}
                                    onClick={() => setActivePassengerIndex(index)}
                                >
                                    <Typography variant="h6">
                                        {passenger.firstName} {passenger.lastName}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        {passenger?.seats?.[flightKey] ? (
                                            <Chip
                                                label={passenger?.seats?.[flightKey]?.seatNumber}
                                                sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2, mt: 1 }} />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No Seat Selected
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary">
                                            {passenger?.seats?.[flightKey]?.price ? `₹ ${passenger?.seats?.[flightKey]?.price}` : ""}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                    <Box display="flex" gap={2} mb={2} sx={{ py: 2 }}>
                        {seatMaps?.map((seg, idx) => {
                            const segment = segments[idx]
                            return (
                                <Chip
                                    key={idx}
                                    label={`${segment?.departureAirport} - ${segment?.arrivalAirport}`}
                                    color={idx === activeSegmentIndex ? "primary" : "default"}
                                    onClick={() => setActiveSegmentIndex(idx)}
                                />
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
                                height: 350,
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
                                    width: 300,
                                    height: 300,
                                    mr: -6,
                                    zIndex: 2,
                                }}
                            />
                            <Box display="flex" alignItems="center"
                                style={{
                                    paddingLeft: 60,
                                    paddingRight: 30,
                                    height: 300,
                                    borderBottomRightRadius: 10,
                                    borderTopRightRadius: 10,
                                    backgroundColor: "#eef7ff",
                                }}
                            >
                                <Box display="flex">
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
