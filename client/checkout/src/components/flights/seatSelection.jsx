import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, Chip, CardContent, Button } from "@mui/material";
import ExitGap from "../../common/flights/seatSelection/exitGap";
import SeatBlock from "../../common/flights/seatSelection/seatBlock";
import PlaneNose from "../../assets/plane-nose.png";
import { useBookingStore } from "store/bookingStore";
import { getBookingDetails } from "../../apis/flights/booking";
import { getSeatMap } from "../../apis/flights/seatMap";
import TripSummary from "./tripSummary";

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
    const { bookingDetails, seatMap } = useBookingStore();
    const segment = bookingDetails?.flightDetail?.segments?.[0];
    const [seatStatusMap, setSeatStatusMap] = useState({});
    const [flightPassengers, setFlightPassengers] = useState([]);
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const ECONONMY_SEAT_MAP = seatMap?.seatLayout?.find(layout => layout.cabin === "ECONOMY") || {};
    const BUSINESS_SEAT_MAP = seatMap?.seatLayout?.find(layout => layout.cabin === "BUSINESS") || {};


    useEffect(() => {
        if (bookingDetails) {
            fetchSeatMap();
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

    const fetchSeatMap = async () => {
        const segment = bookingDetails?.flightDetail?.segments?.[0];
        let flightInstanceKey = `${segment.carrierCode}-${segment.flightNumber}-${segment.departureTime}-${segment.departureAirport}-${segment.arrivalAirport}`;
        await getSeatMap(flightInstanceKey);
    }

    useEffect(() => {
        if (seatMap?.seatStatus) {
            setSeatStatusMap(seatMap?.seatStatus);
        }
    }, [seatMap?.seatStatus]);

    const handleSeatSelect = (seatId) => {
        if (seatStatusMap[seatId] === "reserved") return;

        const currentPassenger = adultPassengers[activePassengerIndex];
        if (!currentPassenger) return;

        // Prevent selecting more seats than adults
        const alreadySelectedSeats = adultPassengers.filter(p => p.seatId).length;
        if (!currentPassenger.seatId && alreadySelectedSeats >= adultPassengers.length) {
            return;
        }

        setFlightPassengers(prev => {
            const updated = [...prev];

            const passengerIndex = updated.findIndex(
                p => p === currentPassenger
            );

            const currentSeat = updated[passengerIndex]?.seatId;

            /* ---------------------------------
            CASE 1: Clicking same seat → DESELECT
            ---------------------------------- */
            if (currentSeat === seatId) {
                updated[passengerIndex] = {
                    ...updated[passengerIndex],
                    seatId: null,
                };

                setSeatStatusMap(map => ({
                    ...map,
                    [seatId]: "available",
                }));

                return updated;
            }

            /* ---------------------------------
               CASE 2: Passenger already has seat → free it
            ---------------------------------- */
            if (currentSeat) {
                setSeatStatusMap(map => ({
                    ...map,
                    [currentSeat]: "available",
                }));
            }

            /* ---------------------------------
               CASE 3: Seat taken by another passenger → block
            ---------------------------------- */
            const isSeatTaken = updated.some(
                (p, idx) => idx !== passengerIndex && p.seatId === seatId
            );

            if (isSeatTaken) return prev;

            /* ---------------------------------
               ASSIGN NEW SEAT
            ---------------------------------- */
            updated[passengerIndex] = {
                ...updated[passengerIndex],
                seatId,
            };

            setSeatStatusMap(map => ({
                ...map,
                [seatId]: "selected",
            }));

            // Move to next passenger
            setActivePassengerIndex(prevIdx =>
                prevIdx < adultPassengers.length - 1 ? prevIdx + 1 : prevIdx
            );

            return updated;
        });


    };

    const handlePayment = async () => {
        history.push("/flight/checkout");
    }
    const adultPassengers = useMemo(
        () => flightPassengers?.filter(p => p.isAdult),
        [flightPassengers]
    );

    const priceBreakdownDetails = useMemo(() => {
        const basePrice = bookingDetails?.priceBreakdown?.basePrice || 0;
        const taxes = bookingDetails?.priceBreakdown?.taxes || 0;
        const addonsPrice = bookingDetails?.priceBreakdown?.addonsPrice || 0;
        return {
            basePrice,
            taxes,
            addonsPrice,
            finalPrice: basePrice + taxes + addonsPrice,
        }
    }, [bookingDetails]);

    console.log("adultPassengers", adultPassengers);

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap"}}>
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
                                    <Typography variant="body2" color="text.secondary">
                                        {passenger.gender}
                                    </Typography>
                                    {passenger?.seatId ? (
                                        <Chip
                                            label={passenger.seatId}
                                            sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2, mt: 1 }} />
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No Seat Selected
                                        </Typography>
                                    )}
                                </Box>
                            )
                        })}
                    </Box>
                    <Box>
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
                                Seat Status
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
                                    <SeatBlock layout={BUSINESS_SEAT_MAP} seatState={seatStatusMap} onSelect={handleSeatSelect} />
                                    <ExitGap />
                                    <SeatBlock layout={ECONONMY_SEAT_MAP} seatState={seatStatusMap} onSelect={handleSeatSelect} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                {/* RIGHT SUMMARY */}
                <Grid item xs={12} md={4}>
                    <TripSummary
                        segment={segment}
                        sourceAirport={bookingDetails?.sourceAirport}
                        destinationAirport={bookingDetails?.destinationAirport}
                        priceBreakdown={priceBreakdownDetails}
                    />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handlePayment}>
                        Proceed to Payment
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SeatSelection;
