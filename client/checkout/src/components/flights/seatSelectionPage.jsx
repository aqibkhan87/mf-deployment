import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, Grid, Chip, Link, Button } from "@mui/material";
import { useHistory } from "react-router-dom"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ExitGap from "../../common/flights/seatSelection/exitGap";
import SeatBlock from "../../common/flights/seatSelection/seatBlock";
import PlaneNose from "../../assets/plane-nose.png";
import { useBookingStore } from "store/bookingStore";
import { getBookingDetails, updateSeatSelectionInBooking } from "../../apis/flights/booking";
import {
    getCheckinBookingDetails,
    updateCheckinSeatSelectionInBooking,
    checkinPaymentForPassengers,
    verifyCheckinPayment
} from "../../apis/flights/checkin";
import { getSeatMaps } from "../../apis/flights/seatMap";
import TripSummary from "../../common/flights/tripSummary";
import { createOrder, verifyPayment } from "../../apis/payment";
import { loadRazorpay } from "../../utils/loadRazorpay";
import TestPaymentDisplay from "../../common/testPaymentDetails";

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
    const isCheckin = history?.location?.pathname?.includes("/check-in/seat-selection")
    const { bookingDetails, seatMaps, checkinDetails } = useBookingStore();

    const flowData = useMemo(() => {
        return isCheckin ? checkinDetails : bookingDetails;
    }, [isCheckin, bookingDetails, checkinDetails]);

    const {
        bookingId,
        priceBreakdown,
        flightDetail = {}
    } = flowData || {};

    const [seatStatusBySegment, setSeatStatusBySegment] = useState({});
    const [flightPassengers, setFlightPassengers] = useState([]);
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const [seatPricing, setSeatPricing] = useState(0);
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
    const activeSeatMap = seatMaps?.[activeSegmentIndex];
    const ECONONMY_SEAT_MAP = seatMaps?.[activeSegmentIndex]?.seatLayout?.find(layout => layout?.cabin === "ECONOMY") || {};
    const BUSINESS_SEAT_MAP = seatMaps?.[activeSegmentIndex]?.seatLayout?.find(layout => layout?.cabin === "BUSINESS") || {};
    const segments = flightDetail?.segments || [];

    const flightKey = activeSeatMap?.flightInstanceKey;
    const seatStatusMap = seatStatusBySegment?.[flightKey] || {};

    useEffect(() => {
        if (!activeSeatMap) return;
        let updatedSeatStatus = {
            BUSINESS: {
                ...activeSeatMap?.seatStatus?.BUSINESS
            },
            ECONOMY: {
                ...activeSeatMap?.seatStatus?.ECONOMY
            }
        };
        flightPassengers?.forEach((passenger) => {
            const seatNumber = passenger?.seats?.[flightKey]?.seatNumber;
            const cabin = passenger?.seats?.[flightKey]?.cabin;
            if (seatNumber) {
                updatedSeatStatus[cabin][seatNumber]["status"] = "selected";
            }
        });
        setSeatStatusBySegment(prev => ({
            ...prev,
            [activeSeatMap.flightInstanceKey]:
                prev[activeSeatMap.flightInstanceKey] || updatedSeatStatus
        }));
    }, [activeSeatMap]);

    useEffect(() => {
        if (bookingDetails?.passengers) {
            fetchSeatMaps();
            if (bookingDetails?.passengers) {
                setFlightPassengers(bookingDetails?.passengers || [])
                if (bookingDetails?.passengers?.length) {
                    let seatPrices = 0;
                    bookingDetails?.passengers?.forEach((p) => {
                        if (p?.isAdult && p?.seats && Object.values(p?.seats)) {
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
        } else if (checkinDetails?.passengers && isCheckin) {
            fetchSeatMaps();

            const passengers = checkinDetails?.passengers || [];
            setFlightPassengers(passengers);

            let seatDelta = 0;

            passengers?.forEach(p => {
                if (!p?.isAdult) return;

                const currentSeatsTotal = sumSeatPrice(p?.seats);
                const paidSeatsTotal = sumSeatPrice(p?.paidSeats);

                seatDelta += Math.max(0, currentSeatsTotal - paidSeatsTotal);
            });

            setSeatPricing(seatDelta);
        }

    }, [bookingDetails, checkinDetails])

    useEffect(() => {
        if (isCheckin) {
            fetchCheckinBooking();
        } else {
            fetchBooking();
        }
    }, [])

    const fetchBooking = async () => {
        await getBookingDetails();
    }

    const fetchCheckinBooking = async () => {
        await getCheckinBookingDetails();
    }

    const fetchSeatMaps = async () => {
        const segments = flightDetail?.segments || [];
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
                            [oldSeat.seatNumber]: {
                                ["status"]: "available"
                            },
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
                            [oldSeat.seatNumber]: {
                                ["status"]: "available"
                            },
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
                        [seatId]: {
                            ["status"]: "selected"
                        },
                    }
                }
            }));
            setSeatPricing((prev) => prev + seatTypeWithPrice?.price)

            // Move to next passenger
            setActivePassengerIndex(prevIdx => {
                let currentInd = prevIdx;
                if (currentInd === adultPassengers?.length - 1) {
                    if (segments?.length > 1) {
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

    const handlePayment = async (e) => {
        e?.preventDefault()
        if (isCheckin) {
            const response = await updateCheckinSeatSelectionInBooking({
                bookingId: bookingId,
                itineraryKey: itineraryKey?.current,
                passengers: adultPassengers,
            });
            if (response?.success) {
                proceedToPayment();
            }
        } else {
            const response = await updateSeatSelectionInBooking({
                bookingId: bookingId,
                itineraryKey: itineraryKey?.current,
                passengers: adultPassengers,
            });
            if (response?.success) {
                proceedToPayment();
            }
        }
    }

    const proceedToPayment = async () => {
        // 1️⃣ Create Order
        let data = {};
        if (isCheckin) {
            data = await checkinPaymentForPassengers({
                type: "FLIGHT", // or ECOMMERCE
                entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
                passengers: adultPassengers
            });
            if (data?.zeroPayment) {
                history.push(`/check-in?PNR=${data?.PNR}&email=${data?.email}`);
                return;
            }
        } else {
            data = await createOrder({
                type: "FLIGHT", // or ECOMMERCE
                entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
            });
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
                    let response = {};
                    if (isCheckin) {
                        response = await verifyCheckinPayment({
                            entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
                            ...res,
                        });
                    } else {
                        response = await verifyPayment({
                            type: "FLIGHT",
                            entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
                            ...res,
                        });
                    }

                    const orderId = response?.orderId;
                    const status = response?.status;
                    const PNR = response?.PNR;
                    if (response?.success) {
                        localStorage.setItem("bookingId", "");
                        localStorage.setItem("search-info", "{}");
                        sessionStorage.setItem("selectedFlight", "{}");
                        if (isCheckin) {
                            const email = response?.email;
                            history.push(`/check-in?PNR=${PNR}&email=${email}`);
                        } else {
                            history.push(`/itinerary?orderId=${orderId}&status=${status}&PNR=${PNR}`);
                        }
                    }
                } catch (err) {
                    console.log("err: Payment verification failed", err)
                }
            },

            modal: {
                ondismiss: async () => {
                    console.log("Payment cancelled failed")
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

    const hasSelectedSeatsForAllSegments = (passenger) => {
        return seatMaps?.every(
            seatMap => passenger?.seats?.[seatMap?.flightInstanceKey]?.seatNumber
        );
    };

    const toggleProceedToPaymentBtn = useMemo(
        () => {
            if (!flightPassengers?.length || !seatMaps?.length) return true;
            return !flightPassengers.every(passenger =>
                hasSelectedSeatsForAllSegments(passenger)
            );
        },
        [flightPassengers, seatMaps, segments]
    );

    const sumSeatPrice = seats =>
        seats
            ? Object.values(seats).reduce(
                (sum, seat) => sum + Number(seat?.price || 0),
                0
            )
            : 0;

    const calculateSeatDelta = () => {
        return flightPassengers?.reduce((total, p) => {
            const currentSeatsTotal = sumSeatPrice(p?.seats);
            const paidSeatsTotal = sumSeatPrice(p?.paidSeats);

            return total + Math.max(0, currentSeatsTotal - paidSeatsTotal);
        }, 0);
    };

    const calculateCheckinDelta = () => {
        return flightPassengers?.reduce((total, p) => {
            const currentTotal = sumSeatPrice(p?.seats);
            const paidTotal = sumSeatPrice(p?.paidSeats);

            return total + Math.max(0, currentTotal - paidTotal);
        }, 0);
    };

    const addonsCheckinPrice = useMemo(() => {
        return flightPassengers?.reduce(
            (sum, p) => sum + (p?.checkinAmount?.addonsPrice || 0),
            0
        );
    }, [flightPassengers]);

    const seatPrices = useMemo(() => {
        // ✅ CHECK-IN
        return calculateSeatDelta();
    }, [flightPassengers, isCheckin]);

    const totalPrice = useMemo(() => {
        if (!isCheckin) {
            return priceBreakdown?.totalPrice + seatPricing;
        }

        // ✅ CHECK-IN
        return calculateCheckinDelta();
    }, [flightPassengers, isCheckin, priceBreakdown, seatPricing]);

    const priceBreakdownDetails = useMemo(() => {
        if (!isCheckin) {
            return {
                ...priceBreakdown,
                seatsPrice: seatPricing,
                totalPrice: totalPrice,
            }
        }
        return {
            ...priceBreakdown,
            addonsPrice: addonsCheckinPrice,
            seatsPrice: seatPrices,
            totalPrice: totalPrice + addonsCheckinPrice,
        }
    }, [bookingDetails, seatPrices, totalPrice, addonsCheckinPrice, seatPricing, checkinDetails]);

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Box >
                        <Link href={isCheckin ? "/check-in/addons" : "/addons"}
                            sx={{
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
                                        {passenger?.title} {passenger?.firstName} {passenger?.lastName}
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
                                minHeight: 300,
                                marginTop: 4,
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
                                    minWidth: 420,
                                    minHeight: 300,
                                    mr: -6,
                                    zIndex: 2,
                                    borderTopLeftRadius: "70%",
                                    borderBottomLeftRadius: "70%"
                                }}
                            />
                            <Box display="flex" alignItems="center"
                                sx={{
                                    paddingLeft: 8,
                                    paddingRight: 4,
                                    marginTop: 0.4,
                                    minHeight: 300,
                                    borderBottomRightRadius: 10,
                                    borderTopRightRadius: 10,
                                    backgroundColor: "#eef7ff",
                                }}
                            >
                                <Box display="flex"
                                    // sx={{ paddingTop: 1, paddingBottom: 1, }}
                                >
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
                    <Button
                        variant="contained"
                        fullWidth 
                        sx={{ mt: 2, textTransform: "none" }}
                        onClick={handlePayment}
                        disabled={toggleProceedToPaymentBtn}
                    >
                        Proceed to payment
                    </Button>
                    <TestPaymentDisplay />
                </Grid>
            </Grid>
        </Box>
    );
}

export default SeatSelection;

