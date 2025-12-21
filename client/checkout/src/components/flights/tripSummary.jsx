import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
} from "@mui/material";
import { useBookingStore } from "store/bookingStore";
import { formatDate, formatTime } from "../../utils/helper";

const TripSummary = ({ segment, sourceAirport, destinationAirport, priceBreakdown }) => {
    const { selectedFlight } = useBookingStore();

    const searchInfo = JSON.parse(sessionStorage.getItem("selectedFlight") || "{}");
    const { passengers: paxObj } = searchInfo;
    const adults = paxObj?.adult || 0;
    const infants = paxObj?.infant || 0;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Trip Summary</Typography>
                <Box p={2} mt={2} bgcolor={"#f7fbff"} border={1} borderRadius={2} borderColor={"#d0e5ff"}>
                    <Typography color="text.secondary" >
                        {adults} Adult{adults > 1 ? "s" : ""}{infants > 0 && `, ${infants} Infant`}
                    </Typography>
                </Box>

                <Box borderRadius={2} border={1} borderColor={"#d0e5ff"} mt={2}>
                    <Box bgcolor={"#f7fbff"} borderRadius={2} sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2
                    }}>
                        <Typography>Flight Details</Typography>
                        <Typography variant="subtitle1">
                            {segment?.carrierCode} {segment?.aircraftCode}, {segment?.flightNumber}
                        </Typography>
                    </Box>
                    <Box p={1} m={1} sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {segment?.cabin}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>
                                <Typography mx={1} fontSize={14}>
                                    {sourceAirport?.city}, {segment?.departureAirport}
                                </Typography>
                                <Typography mx={1} fontSize={12}>
                                    {sourceAirport?.name}
                                </Typography>
                                <Typography mx={1}>
                                    {formatTime(segment?.departureTime)}
                                </Typography>
                            </Typography>
                            <Typography fontWeight="bold">→</Typography>
                            <Typography>
                                <Typography mx={1} fontSize={14}>
                                    {destinationAirport?.city}, {segment?.arrivalAirport}
                                </Typography>
                                <Typography mx={1} fontSize={12}>
                                    {destinationAirport?.name}
                                </Typography>
                                <Typography mx={1}>
                                    {formatTime(segment?.arrivalTime)}
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box >
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(selectedFlight?.date)} | {selectedFlight?.fare?.duration}
                    </Typography>
                </Box>


                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                    <Typography>{adults > 1 ? "Adults" : "Adult"} × {adults}</Typography>
                    <Typography>₹ {priceBreakdown?.basePrice}</Typography>
                </Box>

                {infants > 0 && (
                    <Box display="flex" justifyContent="space-between">
                        <Typography>{infants > 1 ? "Infants" : "Infant"} × {infants}</Typography>
                        <Typography color="success.main">Free</Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />
                {priceBreakdown?.addonsPrice > 0 && (
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Addons</Typography>
                        <Typography>₹ {priceBreakdown?.addonsPrice}</Typography>
                    </Box>
                )}
                {priceBreakdown?.seatsPrice > 0 && (
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Seats Charges</Typography>
                        <Typography>₹ {priceBreakdown?.seatsPrice}</Typography>
                    </Box>
                )}
                {priceBreakdown?.taxes > 0 && (
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Taxes</Typography>
                        <Typography>₹ {Number(priceBreakdown?.taxes)}</Typography>
                    </Box>
                )}
                <Typography align="right" variant="h6">
                    Total: ₹ {priceBreakdown?.finalPrice}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TripSummary