import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import ExitGap from "../../common/flights/seatSelection/exitGap";
import SeatBlock from "../../common/flights/seatSelection/seatBlock";
import PlaneNose from "../../assets/plane-nose.png";
import { useBookingStore } from "store/bookingStore";
import { getBookingDetails } from "../../apis/flights/booking";
import TripSummary from "./tripSummary";

const BASE_FARE = 25000;

const LEFT = [1, 2, 3, 4, 5, 6, 7];
const MIDDLE = [9, 10, 11, 12, 13];
const RIGHT = [15, 16, 17, 18, 19, 20, 21];

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

function SeatLegend() {
    return (
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
    );
}

const PlaneNoseComponent = () => (
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
);

function SeatSelection() {
    const { bookingDetails } = useBookingStore();
    const segment = bookingDetails?.flightDetail?.segments?.[0];
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatStatusMap, setSeatStatusMap] = useState({});

    useEffect(() => {
        fetchBooking();
    }, [])

    const fetchBooking = async () => {
        await getBookingDetails();
    }

    useEffect(() => {
        const fetchedStatus = {
            "3B": "reserved",
            "3C": "reserved",
            "10D": "reserved",
            "18A": "reserved",
        };
        setSeatStatusMap(fetchedStatus);
    }, []
    );

    const handleSeatSelect = (seatId) => {
        if (seatStatusMap[seatId] === "occupied") return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
            setSeatStatusMap({
                ...seatStatusMap,
                [seatId]: "available",
            });
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
            setSeatStatusMap({
                ...seatStatusMap,
                [seatId]: "selected",
            });
        }
    };

    const handlePayment = async () => {
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
                        type: "FLIGHT",
                        entityId,
                        ...res,
                    });

                    if (verify.success) {
                        navigate("/dashbaord");
                    }
                } catch (err) {
                    console.log("errrrrrr", err);
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

        rzp.on("payment.failed", async (err) => {
            alert("Payment failed");
        });

        rzp.open();
    }

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

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Box>
                        <SeatLegend />
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
                            <PlaneNoseComponent />
                            <Box display="flex" alignItems="center"
                                style={{
                                    paddingLeft: 60,
                                    paddingRight: 30,
                                    height: 300,
                                    border: "2px solid #8ec5ff",
                                    borderBottomRightRadius: 10,
                                    borderTopRightRadius: 10,
                                    backgroundColor: "#eef7ff",
                                }}
                            >
                                <Box display="flex">
                                    <SeatBlock columns={LEFT} seatState={seatStatusMap} onSelect={handleSeatSelect} />
                                    <ExitGap />
                                    <SeatBlock columns={MIDDLE} seatState={seatStatusMap} onSelect={handleSeatSelect} />
                                    <ExitGap />
                                    <SeatBlock columns={RIGHT} seatState={seatStatusMap} onSelect={handleSeatSelect} />
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
