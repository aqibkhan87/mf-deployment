import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Chip
} from "@mui/material";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from "@mui/lab";
import { useBookingStore } from "store/bookingStore";
import { formatDate, formatTime, getTimeDifference } from "../../utils/helper";

const resolveFlightData = (mode, {
    selectedFlight,
    bookingDetails,
    checkinDetails,
}) => {
    switch (mode) {
        case "SELECTED_FLIGHT":
            return {
                segments: selectedFlight?.fare?.segments || [],
                connectingAirports: selectedFlight?.connectingAirports || [],
                date: selectedFlight?.date || "",
                duration: selectedFlight?.fare?.duration || "",
                travelerPricing: selectedFlight?.fare?.travelerPricing?.[0] || {},
                passengers: null, // comes from searchInfo
            };

        case "CHECKIN":
        case "BOOKING":
            const details = mode === "CHECKIN" ? checkinDetails : bookingDetails;
            return {
                segments: details?.flightDetail?.segments || [],
                connectingAirports: details?.connectingAirports || [],
                date: details?.date || "",
                duration: details?.flightDetail?.duration || "",
                travelerPricing:
                    details?.flightDetail?.travelerPricing?.[0] || {},
                passengers: details?.passengers || [],
            };

        default:
            return null;
    }
};

const TripSummary = ({ priceBreakdown }) => {
    const history = useHistory();
    const { selectedFlight, bookingDetails, checkinDetails } = useBookingStore();
    let searchInfo = JSON.parse(sessionStorage.getItem("selectedFlight") || "{}");
    const mode = history?.location?.pathname?.includes("/check-in/seat-selection") || 
    history?.location?.pathname?.includes("/check-in/addons") ? "CHECKIN" : "BOOKING"


    const flightData = useMemo(() => {
        return resolveFlightData(mode, {
            selectedFlight,
            bookingDetails,
            checkinDetails,
        });
    }, [mode, selectedFlight, bookingDetails, checkinDetails]);

    const { segments, date, duration, travelerPricing, connectingAirports, } = flightData;
    // console.log("segments, date, duration, travelerPricing", segments, date, duration, travelerPricing, checkinDetails)
    const segment = segments?.[0];

    const passengerCounts = useMemo(() => {
        if (!flightData?.passengers) {
            return searchInfo?.passengers || { adult: 0, infant: 0 };
        }

        return flightData.passengers.reduce(
            (acc, p) => {
                acc.adult += 1;
                if (p?.infantTagged?.id) acc.infant += 1;
                return acc;
            },
            { adult: 0, infant: 0 }
        );
    }, [flightData, searchInfo]);

    const adults = passengerCounts?.adult;
    const infants = passengerCounts?.infant;

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
                        <Typography>Flight Summary</Typography>
                    </Box>
                    <Box p={1} m={1}>

                        <Box sx={{
                            border: "3px solid #f7fbff"
                        }}>
                            <Box sx={{ display: 'flex', p: 2 }}>
                                <Chip variant="subtitle1" label={segment?.cabin} fontWeight="bold" />
                            </Box>
                            {segments?.map((seg, i) => {
                                const departureAirportObj = connectingAirports?.find(a => a?.iata === seg?.departureAirport);
                                const arrivalAirportObj = connectingAirports?.find(a => a?.iata === seg?.arrivalAirport);
                                const arrivalTime = segments?.length > 1 ? segments[i - 1]?.arrivalTime : ""
                                return (
                                    <Timeline
                                        key={i}
                                        position="right"
                                        sx={{
                                            width: "100%",
                                            px: 2,
                                            "& .MuiTimelineContent-root": {
                                                flex: 1,
                                                width: "100%",
                                                maxWidth: "100%",
                                            },
                                            "& .MuiTimelineItem-root:before": {
                                                flex: 0,
                                                padding: 0,
                                            },
                                        }}
                                    >
                                        {arrivalTime && <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color={i == 0 ? "secondary" : "grey"} />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Box className="flex">
                                                    <Typography sx={{ px: 2, py: 1, bgcolor: "#d0e5ff", borderRadius: 20, fontSize: 14 }}>
                                                        Layover at {departureAirportObj?.city} {getTimeDifference(seg?.departureTime, arrivalTime)}
                                                    </Typography>
                                                </Box>
                                            </TimelineContent>
                                        </TimelineItem>}
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color={i == 0 ? "secondary" : "grey"} />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Box>
                                                    <Typography>
                                                        {formatTime(seg?.departureTime)}
                                                        <Typography component="span" fontSize={14} sx={{ pl: 1 }}>
                                                            {departureAirportObj?.city}, {seg?.departureAirport}
                                                        </Typography>
                                                    </Typography>
                                                    <Typography fontSize={12}>
                                                        {departureAirportObj?.name} {seg?.departureTerminal ? `, T${seg?.departureTerminal}` : ""}
                                                    </Typography>
                                                    <Typography fontSize={12}>
                                                        {seg?.carrierCode} {seg?.aircraftCode}, {seg?.flightNumber}
                                                    </Typography>
                                                </Box>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot
                                                    variant="outlined"
                                                    color={segments?.length >= 1 && segments?.length - 1 == i ? "primary" : "grey"}
                                                />
                                                {segments?.length - 1 !== i && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Box>
                                                    <Typography>
                                                        {formatTime(seg?.arrivalTime)}
                                                        <Typography component="span" fontSize={14} sx={{ pl: 1 }}>
                                                            {arrivalAirportObj?.city}, {seg?.arrivalAirport}
                                                        </Typography>
                                                    </Typography>
                                                    <Typography fontSize={12}>
                                                        {arrivalAirportObj?.name} {seg?.arrivalTerminal ? `, T${seg?.arrivalTerminal}` : ""}
                                                    </Typography>
                                                </Box>
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                )
                            }
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box >
                    <Box>
                        <Typography color="text.secondary" fontSize={13}>
                            {formatDate(date)} | {duration}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {travelerPricing?.includedCabinBags?.quantity ?
                            `Hand: Up to ${travelerPricing?.includedCabinBags?.quantity}PC`
                            : ``}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {travelerPricing?.includedCabinBags?.weight ?
                            `Hand: Up to ${travelerPricing?.includedCabinBags?.weight}${travelerPricing?.includedCabinBags?.weightUnit}`
                            : ``}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {travelerPricing?.includedCheckedBags?.weight ?
                            ` | Check-in: ${travelerPricing?.includedCheckedBags?.weight}${travelerPricing?.includedCheckedBags?.weightUnit}`
                            : ``}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {travelerPricing?.includedCheckedBags?.quantity ?
                            ` | Check-in: ${travelerPricing?.includedCheckedBags?.quantity}PC`
                            : ``}
                    </Typography>

                </Box>


                <Divider sx={{ my: 2 }} />
                {priceBreakdown?.basePrice ?
                    <Box display="flex" justifyContent="space-between">
                        <Typography>{adults > 1 ? "Adults" : "Adult"} × {adults}</Typography>
                        <Typography>₹ {Math.floor(priceBreakdown?.basePrice)}</Typography>
                    </Box> : ""}

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
                        <Typography>₹ {Math.floor(priceBreakdown?.addonsPrice)}</Typography>
                    </Box>
                )}
                {priceBreakdown?.seatsPrice > 0 && (
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Seats Charges</Typography>
                        <Typography>₹ {Math.floor(priceBreakdown?.seatsPrice)}</Typography>
                    </Box>
                )}
                {priceBreakdown?.taxes > 0 && (
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Taxes</Typography>
                        <Typography>₹ {Math.floor(priceBreakdown?.taxes)}</Typography>
                    </Box>
                )}
                <Typography align="right" variant="h6">
                    Total: ₹ {Math.floor(priceBreakdown?.totalPrice)}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TripSummary