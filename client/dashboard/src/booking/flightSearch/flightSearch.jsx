import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import FlightIcon from "@mui/icons-material/Flight";
import { IconButton } from '@mui/material';
import dayjs from "dayjs";
import { useBookingStore } from "store/bookingStore";
import { searchFlights } from "../../apis/flights/booking";
import BookingWidget from "../bookingwidget/bookingWidget";
import { eventEmitter, formatTime, formatDuration, getTimeDifference } from "../../utils/helper"
import ConnectingFlightPopup from "../../common/simplePopup";
import "./flightSearch.scss"

export const getAllowedDates = (days = 10) => {
    const today = dayjs().startOf("day");
    const endDate = today.add(days, "day");

    const dates = [];
    let current = today;

    while (current.isBefore(endDate) || current.isSame(endDate)) {
        dates.push({
            iso: current.format("YYYY-MM-DD"),
            label: current.format("DD MMM"),
            day: current.format("ddd"),
            date: current,
        });
        current = current.add(1, "day");
    }

    return dates;
};

function FlightResults() {
    const { selectedFlight, setSearchEditing, sourceAirport, destinationAirport } = useBookingStore();
    const history = useHistory();
    const [enableBookingWidget, setEnableBookingWidget] = useState(false);
    const [dates] = useState(getAllowedDates());
    const [searchInfo, setSearchInfo] = useState({});
    const connectingAirports = selectedFlight?.connectingAirports;
    const [flightInfo, setFlightInfo] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);

    const openPopover = (event, flightInfoSelected) => {
        setAnchorEl(event.currentTarget);
        setFlightInfo(flightInfoSelected)
    };

    const closePopover = () => {
        setAnchorEl(null);
        setFlightInfo({})
    };

    useEffect(() => {
        if (localStorage.getItem("search-info")) {
            const searchInfo = localStorage.getItem("search-info") ? JSON.parse(localStorage.getItem("search-info")) : {};
            setSearchInfo({
                from: searchInfo?.from || "DEL",
                to: searchInfo?.to || "BOM",
                date: searchInfo?.date,
                passengers: searchInfo?.passengers || {}
            })
        }
    }, []);

    useEffect(() => {
        if (searchInfo?.date && searchInfo?.from && searchInfo?.to && searchInfo?.passengers) {
            getSearchFlights();
        }
    }, [searchInfo]);

    useEffect(() => {
        const handler = async (event) => {
            const payload = event.detail;
            if (payload?.searchUpdated) {
                setSearchEditing(false);
                setEnableBookingWidget(false);
                setSearchInfo({
                    from: payload?.from,
                    to: payload?.to,
                    date: payload?.date,
                    passengers: payload?.passengers
                })
            }
        };
        window.addEventListener("SearchUpdated", handler);
        return () => {
            window.removeEventListener("SearchUpdated", handler);
        };
    }, []);

    const getSearchFlights = async () => {
        await searchFlights(searchInfo);
    }


    const handleFlightSearch = async (e, flight) => {
        e?.preventDefault();
        const payload = {
            flightId: selectedFlight._id,
            providerId: flight.providerOfferId,
            ...searchInfo,
        };

        sessionStorage.setItem(
            "selectedFlight",
            JSON.stringify(payload)
        );
        history.push(`/passenger-edit`)
    }

    const handleEdit = () => {
        setEnableBookingWidget(!enableBookingWidget)
        setSearchEditing(true);
        const eventData = { ...searchInfo, from: sourceAirport, to: destinationAirport };
        eventEmitter("UpdateSearchInBooking", eventData)
    }

    const cancelEditBooking = () => {
        setEnableBookingWidget(!enableBookingWidget)
    }

    const handleNewDate = async (searchDate) => {
        const searchInfo = localStorage.getItem("search-info") ? JSON.parse(localStorage.getItem("search-info")) : "";
        let payload = {
            ...searchInfo,
            date: searchDate?.iso
        }
        localStorage.setItem("search-info", JSON.stringify(payload))
        setSearchInfo(payload)
    }

    return (
        <Box className="search-flight-main">
            <Box sx={{
                background: "linear-gradient(0deg,#15457b,#051423)",
                p: 2,
                mb: 5
            }}>
                <Box
                    sx={{
                        position: "relative",
                        display: "block", // always render
                        visibility: enableBookingWidget ? "visible" : "hidden", // hide visually
                        height: enableBookingWidget ? "auto" : 0, // optional: collapse height
                    }}
                >
                    <IconButton
                        onClick={cancelEditBooking}
                        color="primary"
                        sx={{
                            position: "absolute",
                            right: "20px",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <BookingWidget />
                </Box>
                {!enableBookingWidget &&
                    <Box className="flex"
                        sx={{
                            backgroundColor: "aliceblue",
                            borderRadius: 100,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            textAlign: "center",
                            borderWidth: "1px",
                            margin: "auto",
                            width: { sm: "100%", md: "50%" }

                        }}
                    >
                        <Typography className="border-right flex-1" sx={{ fontSize: { xs: 14, md: 16 }}}>
                            {sourceAirport?.city} - {destinationAirport?.city}
                        </Typography>
                        <Typography className="border-right flex-1" sx={{ fontSize: { xs: 14, md: 16 }}}>
                            {searchInfo?.date}
                        </Typography>
                        <Typography className="flex-1" sx={{ fontSize: { xs: 14, md: 16 }}}>
                            {searchInfo?.passengers?.adult} Passenger
                        </Typography>
                        <IconButton onClick={handleEdit} color="primary" sx={{ fontSize: { xs: 14, md: 16 }}}>
                            <EditIcon />
                        </IconButton>
                    </Box>}
            </Box>
            <Box className="flight-search"
                sx={{
                    width: "100%",
                    maxWidth: "1024px",
                    margin: "auto",
                    p: 4
                }}
            >
                <Swiper
                    modules={[Navigation]}
                    navigation={true}
                    spaceBetween={20}
                    breakpoints={{
                        1024: { slidesPerView: 8 },
                        768: { slidesPerView: 5 },
                        480: { slidesPerView: 3 },
                    }}
                    style={{ marginBottom: "32px" }}
                >
                    {dates?.map((flightSearchDate, i) => {
                        return (
                            <SwiperSlide
                                key={i}
                                onClick={() => handleNewDate(flightSearchDate)}
                            >
                                <Card
                                    style={{
                                        border: `${flightSearchDate?.iso === searchInfo?.date ? "1px solid #6AA0FF" : ""}`
                                    }}
                                    sx={{ cursor: "pointer", height: "100%" }}
                                >
                                    <CardContent className="items-center">
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{
                                                    color: `${flightSearchDate?.iso === searchInfo?.date ? "#6AA0FF" : ""}`
                                                }}
                                            >
                                                {flightSearchDate?.day}
                                            </Typography>
                                            <Typography sx={{
                                                color: `${flightSearchDate?.iso === searchInfo?.date ? "#6AA0FF" : ""}`
                                            }}>
                                                {flightSearchDate?.label}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
                <Box className="text-center" sx={{
                    backgroundColor: "#1976d2", borderRadius: 100, mt: 3, p: 2
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: {xs: 500, md: 600 }, color: "#fff", fontSize: { xs: 14, md: 24 }
                    }}>
                        Flights from {sourceAirport?.city} to {destinationAirport?.city}
                    </Typography>
                </Box>
                <Box>
                    <Typography className=" text-gray-800" sx={{ marginTop: 2, fontWeight: 500 }}>
                        {selectedFlight?.fares?.length || 0} Flights Found
                    </Typography>
                </Box>
                {/* Flight List */}
                <Box sx={{ py: 4 }}>
                    {selectedFlight?.fares?.map((fare) => {
                        const segments = fare?.segments || [];

                        if (!segments.length) return null;

                        const firstSegment = segments[0];
                        const lastSegment = segments[segments.length - 1];

                        const departureAirportObj = connectingAirports?.find(
                            a => a?.iata === firstSegment?.departureAirport
                        );

                        const arrivalAirportObj = connectingAirports?.find(
                            a => a?.iata === lastSegment?.arrivalAirport
                        );
                        return (
                            <Box
                                key={fare.providerOfferId}
                                className="shadow flex justify-between"
                                sx={{
                                    borderColor: "#f7fbff",
                                    bgcolor: "#fff", borderRadius: 2, p: 3,
                                    my: 3,
                                    alignItems: { xs: "flex-start", md: "center" },
                                    flexDirection: { xs: "column", md: "row" }
                                }}
                            >
                                {/* Left Section */}
                                <Box className="flex flex-col"
                                    sx={{ width: { xs: "100%", md: "80%" }, }}
                                >
                                    {/* Airline Info */}
                                    <Box className="flex items-center" sx={{ mb: 2 }}>
                                        <Box
                                            src={fare?.airline?.logo}
                                            alt={fare?.airline?.name}
                                            component="img"
                                            sx={{
                                                width: "40px", height: "40px", objectFit: "contain", borderRadius: 1,
                                                mr: 3
                                            }}
                                        />
                                        <Box className="flex flex-col">
                                            <Box className="text-lg font-semibold">
                                                {fare?.airline?.name} ({fare?.airline?.code})
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box className="flex items-start justify-between">
                                        {/* ORIGIN */}
                                        <Box className="flex-1">
                                            <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, md: 20 } }}>
                                                {formatTime(firstSegment?.departureTime)}
                                                <Typography variant="span" className="text-xs" sx={{ pl: 1 }}>
                                                    {departureAirportObj?.iata}
                                                    {firstSegment?.departureTerminal
                                                        ? `, T${firstSegment?.departureTerminal}`
                                                        : ""}
                                                </Typography>
                                            </Typography>

                                            <Typography className="text-gray-500" sx={{ fontSize: 12 }}>
                                                {departureAirportObj?.city} - {departureAirportObj?.name},{" "}
                                                {departureAirportObj?.country}
                                            </Typography>
                                        </Box>

                                        {/* DURATION & STOPS */}
                                        <Box className="flex-1 text-center">
                                            <Box className="font-semibold" sx={{ fontSize: { xs: 14, md: 18 } }}>
                                                {formatDuration(fare?.duration)}
                                            </Box>

                                            <Typography
                                                sx={{
                                                    width: {xs: 50, md: 60 },
                                                    height: 5,
                                                    borderRadius: 8,
                                                    backgroundColor: "#1976d2",
                                                    margin: "6px auto"
                                                }}
                                            />

                                            <Typography
                                                onClick={(e) => openPopover(e, fare)}
                                                sx={{ cursor: "pointer", fontSize: { xs: 12, md: 14 } }}
                                            >
                                                {segments.length > 1
                                                    ? `${segments.length - 1} Stop`
                                                    : "Non Stop"}
                                            </Typography>
                                        </Box>

                                        {/* DESTINATION (FINAL, NOT CONNECTING) */}
                                        <Box className="flex-1 text-right">
                                            <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, md: 20 } }}>
                                                {formatTime(lastSegment?.arrivalTime)}
                                                <Typography variant="span" className="text-xs" sx={{ pl: 1 }}>
                                                    {arrivalAirportObj?.iata}
                                                    {lastSegment?.arrivalTerminal
                                                        ? `, T${lastSegment?.arrivalTerminal}`
                                                        : ""}
                                                </Typography>
                                            </Typography>

                                            <Typography className="text-gray-500" sx={{ fontSize: 12 }}>
                                                {arrivalAirportObj?.city} - {arrivalAirportObj?.name},{" "}
                                                {arrivalAirportObj?.country}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Aircraft & Cabin Info */}
                                    <Box className="text-gray-600" sx={{ fontSize: { xs: 12, md: 14 }, mt: 2 }}>
                                        {fare?.segments?.map((seg, idx) => (
                                            <Typography variant="span" key={idx}>
                                                <FlightIcon /> {seg?.aircraftCode} • Cabin: {seg?.cabin}
                                                {idx < fare?.segments?.length - 1 && " | "}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Price & Button */}
                                <Box className="flex items-center justify-between"
                                    sx={{
                                        width: { xs: "100%", md: "240px" },
                                        marginTop: { xs: 2, md: 0 },
                                        alignItems: { xs: "center", md: "flex-end" },
                                        flexDirection: { xs: "row", md: "column" }
                                    }}
                                >
                                    <Box className="flex"
                                        sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 600, alignItems: "center" }}
                                    >
                                        ₹ {Math.floor(fare?.totalPrice)}
                                        <Typography variant="span" sx={{
                                            fontSize: { xs: 12, md: 14 }, paddingLeft: 1, fontWeight: 500
                                        }}>
                                            / adult
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        className="transition"
                                        onClick={(e) => handleFlightSearch(e, fare)}
                                        sx={{ marginTop: 2, px: { xs: 2, md: 4 }, py: { xs: 1, md: 2 } }}
                                    >
                                        Select Flight
                                    </Button>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <ConnectingFlightPopup
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closePopover}>
                <div
                    key={flightInfo.providerOfferId}
                    className="p-5 flex flex-col justify-between items-start md:items-center"
                    style={{ borderColor: "#f7fbff", borderRadius: 2 }}
                >
                    {/* Left Section */}
                    <div className="flex flex-col space-y-3 w-full">
                        {/* Airline Info */}
                        <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                                <div className="text-lg font-semibold">
                                    {flightInfo?.airline?.name} ({flightInfo?.airline?.code})
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg font-semibold">
                                    {formatDuration(flightInfo?.duration)}
                                </div>
                            </div>
                        </div>

                        {/* Flight Segments */}
                        {flightInfo?.segments?.map((segment, index) => {
                            const departureAirportObj = connectingAirports?.find(a => a?.iata === segment?.departureAirport);
                            const arrivalAirportObj = connectingAirports?.find(a => a?.iata === segment?.arrivalAirport);
                            let arrivalTime = flightInfo?.segments?.length > 1 ? flightInfo?.segments[index - 1]?.arrivalTime : ""
                            return (
                                <Box key={index}>
                                    {arrivalTime &&
                                        <Box className="flex justify-center py-4">
                                            <Box>
                                                <Typography sx={{ px: 4, py: 2, bgcolor: "#d0e5ff", borderRadius: 20 }}>
                                                    Layover at {departureAirportObj?.city} {getTimeDifference(segment?.departureTime, arrivalTime)}
                                                </Typography>
                                            </Box>
                                        </Box>}
                                    <Box className="flex items-center justify-between">
                                        <Box className="flex-1">
                                            <p className="text-xl font-bold">
                                                {formatTime(segment?.departureTime)}
                                                <span className="pl-2 text-xs">
                                                    {departureAirportObj?.iata} {segment?.departureTerminal ? `, T${segment?.departureTerminal}` : ""}
                                                </span>
                                            </p>
                                            <p className="text-gray-500  text-xs">
                                                {departureAirportObj?.city} - {departureAirportObj?.name}, {departureAirportObj?.country}
                                            </p>
                                        </Box>
                                        <Box className="flex-1">
                                            <p className="text-gray-600 text-center">
                                                {formatDuration(segment?.duration)}
                                            </p>
                                            <p style={{ width: 60, height: 5, borderRadius: 8, backgroundColor: "#1976d2", margin: "6px auto" }}></p>
                                        </Box>
                                        <Box className="flex-1">
                                            <p className="text-xl font-bold">
                                                {formatTime(segment?.arrivalTime)}
                                                <span className="pl-2 text-xs">
                                                    {arrivalAirportObj?.iata} {segment?.arrivalTerminal ? `, T${segment?.arrivalTerminal}` : ""}
                                                </span>
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {arrivalAirportObj?.city} - {arrivalAirportObj?.name}, {arrivalAirportObj?.country}
                                            </p>
                                        </Box>
                                    </Box>

                                </Box>
                            )
                        })}

                        {/* Aircraft & Cabin Info */}
                        <div className="text-gray-600 text-sm">
                            {flightInfo?.segments?.map((seg, idx) => (
                                <span key={idx}>
                                    <FlightIcon /> {seg?.aircraftCode} • Cabin: {seg?.cabin}
                                    {idx < flightInfo?.segments?.length - 1 && " | "}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </ConnectingFlightPopup>
        </Box>
    );
}

export default FlightResults;