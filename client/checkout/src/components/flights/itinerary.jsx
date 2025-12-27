import React, { useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Divider,
    Grid,
    Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightIcon from "@mui/icons-material/Flight";
import { useBookingStore } from "store/bookingStore";
import { getItineraryDetails } from "../../apis/flights/itinerary";
import { formatDate, formatTime, formatDuration } from "../../utils/helper";


const ItineraryPage = () => {
    const { itineraryDetails } = useBookingStore();
    const params = new URLSearchParams(window.location.search);
    const PNR = params.get("PNR");
    const status = params.get("status");
    const orderId = params.get("orderId");
    const bookingDetails = itineraryDetails?.bookingDetails;
    const priceBreakdown = itineraryDetails?.bookingDetails?.priceBreakdown;
    const contact = bookingDetails?.contact;
    const segments = bookingDetails?.flightDetail?.segments;
    const sourceAirport = bookingDetails?.sourceAirport;
    const destinationAirport = bookingDetails?.destinationAirport;
    const connectingAirports = bookingDetails?.connectingAirports;
    const orderedDate = itineraryDetails?.paidAt;

    useEffect(() => {
        if (PNR && status && orderId) {
            getItineraryDetails({ orderId, status, PNR });
        }
    }, [])

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 3 }}>
            <Paper
                sx={{
                    position: "relative",
                    height: 260,
                    backgroundImage: `url(${process.env.API_BASE_URL}/images/${destinationAirport?.iata}.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Avatar sx={{ bgcolor: "#2e7d32", mb: 1 }}>
                        <CheckCircleIcon />
                    </Avatar>

                    <Typography variant="h6" fontWeight={700}>
                        Booking Confirmed
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        {sourceAirport?.iata} → {destinationAirport?.iata}
                    </Typography>

                    <Typography variant="body2">
                        {formatDate(orderedDate)}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        PNR: <strong>{PNR}</strong>
                    </Typography>
                </Box>
            </Paper>

            {/* ===================== CONFIRMATION MESSAGE ===================== */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography>
                    Your booking is confirmed. Confirmation has been sent to:
                    <Typography variant="span" fontWeight={600}>
                        {contact?.email}
                    </Typography>
                </Typography>

            </Paper>

            {/* ===================== FLIGHT SEGMENTS ===================== */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Flight Details
                </Typography>

                {segments?.map((seg, index) => {
                    const departureAirportObj = connectingAirports?.find(a => a?.iata === seg?.departureAirport);
                    const arrivalAirportObj = connectingAirports?.find(a => a?.iata === seg?.arrivalAirport);
                    return (
                        <Box key={index}>
                            {index > 0 && (
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary", my: 2, textAlign: "center" }}
                                >
                                    Layover at {departureAirportObj?.city}
                                </Typography>
                            )}

                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <Typography fontWeight={600}>
                                        <FlightIcon color="action" /> {seg?.carrierCode} {seg?.aircraftCode}, {seg?.flightNumber} ({formatDate(seg?.departureTime)})
                                    </Typography>
                                </Grid>

                                <Grid item xs={5}>
                                    <Typography variant="body2" color="text.secondary">
                                        Departure
                                    </Typography>
                                    <Typography fontWeight={600}>
                                        {seg?.departureAirport} – {formatTime(seg?.departureTime)}
                                    </Typography>
                                    <Typography variant="body2">{departureAirportObj?.city}</Typography>
                                </Grid>

                                <Grid item xs={2} textAlign="center">
                                    <FlightIcon color="action" />
                                    <Typography variant="body2">{formatDuration(seg?.duration)}</Typography>
                                </Grid>

                                <Grid item xs={5}>
                                    <Typography variant="body2" color="text.secondary">
                                        Arrival
                                    </Typography>
                                    <Typography fontWeight={600}>
                                        {seg?.arrivalAirport} – {formatTime(seg?.arrivalTime)}
                                    </Typography>
                                    <Typography variant="body2">{arrivalAirportObj?.city}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Baggage Allowance
                                    </Typography>
                                    <Typography>
                                        {seg?.baggage?.cabin} Cabin • {seg?.baggage?.checkin} Check-in
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    )
                })}
            </Paper>

            {/* ===================== PASSENGERS & ADDONS ===================== */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Passengers & Add-ons
                </Typography>

                {bookingDetails?.passengers?.map((p, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                        <Typography fontWeight={600}>
                            {p?.firstName} {p?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Seat: {p?.seat || "Not assigned"} | Meal: {p?.meal || "Standard"}
                        </Typography>
                    </Box>
                ))}
            </Paper>

            {/* ===================== PAYMENT SUMMARY ===================== */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Payment Details
                </Typography>

                <Grid container spacing={2}>
                    {priceBreakdown?.basePrice &&
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                                Adults
                            </Typography>
                            <Typography>₹ {priceBreakdown?.basePrice}</Typography>
                        </Grid>}
                    {priceBreakdown?.seatsPrice &&
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                                Seats
                            </Typography>
                            <Typography>₹ {priceBreakdown?.seatsPrice}</Typography>
                        </Grid>}
                    {priceBreakdown?.addonsPrice &&
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                                Addons
                            </Typography>
                            <Typography>₹ {priceBreakdown?.addonsPrice}</Typography>
                        </Grid>}
                    {priceBreakdown?.taxes &&
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                                Taxes
                            </Typography>
                            <Typography>₹ {priceBreakdown?.taxes}</Typography>
                        </Grid>}
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Payment Mode
                        </Typography>
                        <Typography>{itineraryDetails?.gateway}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Transaction ID
                        </Typography>
                        <Typography>{itineraryDetails?.receipt}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography fontWeight={700}>
                            Total Paid: ₹{itineraryDetails?.amount}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* ===================== CONTACT DETAILS ===================== */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Contact Details
                </Typography>
                <Typography>{contact?.email}</Typography>
                <Typography>{contact?.mobile}</Typography>
            </Paper>
        </Box>
    );
};

export default ItineraryPage;
