import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, Grid, Chip, CardContent, Button, Paper } from "@mui/material";
import ExitGap from "../../common/flights/seatSelection/exitGap";
import SeatBlock from "../../common/flights/seatSelection/seatBlock";
import PlaneNose from "../../assets/plane-nose.png";
import { useBookingStore } from "store/bookingStore";
import { getBookingDetails, updateSeatSelectionInBooking } from "../../apis/flights/booking";
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
    const itineraryKey = useRef(null);
    const { bookingDetails, seatMap } = useBookingStore();
    const segment = bookingDetails?.flightDetail?.segments?.[0];
    const [seatStatusMap, setSeatStatusMap] = useState({});
    const [flightPassengers, setFlightPassengers] = useState([]);
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const [seatPricing, setSeatPricing] = useState(0);
    const ECONONMY_SEAT_MAP = seatMap?.seatLayout?.find(layout => layout.cabin === "ECONOMY") || {};
    const BUSINESS_SEAT_MAP = seatMap?.seatLayout?.find(layout => layout.cabin === "BUSINESS") || {};
    const sourceAirport = bookingDetails?.sourceAirport;
    const destinationAirport = bookingDetails?.destinationAirport;


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
        const segments = bookingDetails?.flightDetail?.segments || [];
        itineraryKey.current = segments
            .map(seg =>
                `${seg.carrierCode}-${seg.flightNumber}-${seg.departureTime}`
            )
            .join("_");
        await getSeatMap(itineraryKey.current);
    }

    useEffect(() => {
        if (seatMap?.seatStatus) {
            setSeatStatusMap(seatMap?.seatStatus);
        }
    }, [seatMap?.seatStatus]);

    const handleSeatSelect = (seatId, seatLayoutType, seatTypeWithPrice) => {
        if (seatStatusMap[seatLayoutType][seatId] === "reserved") return;

        const currentPassenger = adultPassengers[activePassengerIndex];
        if (!currentPassenger) return;

        // Prevent selecting more seats than adults
        const alreadySelectedSeats = adultPassengers.filter(p => p?.seat?.seatNumber).length;
        if (!currentPassenger?.seat?.seatNumber && alreadySelectedSeats >= adultPassengers.length) {
            return;
        }

        setFlightPassengers(prev => {
            const updated = [...prev];

            const passengerIndex = updated.findIndex(
                p => p === currentPassenger
            );

            const oldSeat = updated[passengerIndex]?.seat;

            /* ---------------------------------
            CASE 1: Clicking same seat → DESELECT
            ---------------------------------- */
            if (oldSeat?.seatNumber === seatId) {
                setSeatStatusMap(map => ({
                    ...map,
                    [oldSeat.cabin]: {
                        ...map[oldSeat.cabin],
                        [seatId]: "available",
                    }
                }));
                setSeatPricing(seatPricing - oldSeat?.price);
                updated[passengerIndex] = {
                    ...updated[passengerIndex],
                    seat: null,
                };

                return updated;
            }

            /* ---------------------------------
            CASE 2: Seat taken by another passenger → block
            ---------------------------------- */

            const isSeatTaken = updated.some(
                (p, idx) => idx !== passengerIndex && p?.seat?.seatNumber === seatId
            );

            if (isSeatTaken) return prev;


            /* ---------------------------------
               CASE 3: Passenger already has seat → free it
            ---------------------------------- */
            if (oldSeat) {
                setSeatStatusMap(map => ({
                    ...map,
                    [oldSeat.cabin]: {
                        ...map[oldSeat.cabin],
                        [oldSeat.seatNumber]: "available",
                    }
                }));
                setSeatPricing(seatPricing - seatTypeWithPrice?.price)
            }

            /* ---------------------------------
               ASSIGN NEW SEAT
            ---------------------------------- */
            updated[passengerIndex] = {
                ...updated[passengerIndex],
                seat: seatTypeWithPrice,
            };

            setSeatStatusMap(map => ({
                ...map,
                [seatLayoutType]: {
                    ...map[seatLayoutType],
                    [seatId]: "selected",
                }
            }));

            setSeatPricing(seatPricing + seatTypeWithPrice?.price)

            // Move to next passenger
            setActivePassengerIndex(prevIdx =>
                prevIdx < adultPassengers.length - 1 ? prevIdx + 1 : prevIdx
            );

            return updated;
        });
    };

    const handlePayment = async () => {
        await updateSeatSelectionInBooking({
            bookingId: bookingDetails?.bookingId,
            itineraryKey: itineraryKey?.current,
            passengers: adultPassengers,
        });

        // history.push("/flight/checkout");
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

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ my: 2, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
                        <Typography align="center" fontWeight="bold">
                            {sourceAirport?.city} to {destinationAirport?.city}
                        </Typography>
                    </Paper>
                    <Box>
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
                                    <Typography variant="body2" color="text.secondary">
                                        {passenger.gender}
                                    </Typography>
                                    {passenger?.seat?.seatNumber ? (
                                        <Chip
                                            label={passenger.seat.seatNumber}
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
                                        activePassenger={adultPassengers[activePassengerIndex]}
                                    />
                                    <ExitGap />
                                    <SeatBlock
                                        layout={ECONONMY_SEAT_MAP}
                                        seatState={seatStatusMap["ECONOMY"]}
                                        onSelect={handleSeatSelect}
                                        seatLayoutType="ECONOMY"
                                        activePassenger={adultPassengers[activePassengerIndex]}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>}
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
