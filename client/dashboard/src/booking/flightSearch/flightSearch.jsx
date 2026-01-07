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
                {!enableBookingWidget && <Box className="flex w-full md:w-1/2 mx-auto shadow border text-center items-center"
                    sx={{ backgroundColor: "aliceblue", borderRadius: 100, justifyContent: "space-evenly" }}>
                    <Typography className="border-right flex-1">
                        {sourceAirport?.city} - {destinationAirport?.city}
                    </Typography>
                    <Typography className="border-right flex-1">
                        {searchInfo?.date}
                    </Typography>
                    <Typography className="flex-1">
                        {searchInfo?.passengers?.adult} Passenger
                    </Typography>
                    <IconButton onClick={handleEdit} color="primary">
                        <EditIcon />
                    </IconButton>
                </Box>}
            </Box>
            <Box className="w-full max-w-5xl mx-auto p-4 space-y-6 flight-search">
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
                                <Card className="cursor-pointer h-full"
                                    style={{
                                        border: `${flightSearchDate?.iso === searchInfo?.date ? "1px solid #6AA0FF" : ""}`
                                    }}
                                >
                                    <CardContent className=" items-center">
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
                <Box className="shadow p-4 border text-center" sx={{ backgroundColor: "#1976d2", borderRadius: 100, mt: 3 }}>
                    <Typography variant="h6" className="text-2xl font-semibold text-white">
                        Flights from {sourceAirport?.city} to {destinationAirport?.city}
                    </Typography>
                </Box>
                <Box>
                    <p className="mt-2 text-gray-800 font-medium">
                        {selectedFlight?.fares?.length || 0} Flights Found
                    </p>
                </Box>
                {/* Flight List */}
                <div className="space-y-4">
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
                            <div
                                key={fare.providerOfferId}
                                className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
                                style={{ borderColor: "#f7fbff", borderRadius: 2 }}
                            >
                                {/* Left Section */}
                                <div className="flex flex-col space-y-3 w-full md:w-2/3">
                                    {/* Airline Info */}
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={fare?.airline?.logo}
                                            alt={fare?.airline?.name}
                                            className="w-10 h-10 object-contain rounded"
                                        />
                                        <div className="flex flex-col">
                                            <div className="text-lg font-semibold">
                                                {fare?.airline?.name} ({fare?.airline?.code})
                                            </div>
                                        </div>
                                    </div>

                                    <Box className="flex items-center justify-between">
                                        {/* ORIGIN */}
                                        <Box className="flex-1">
                                            <p className="text-xl font-bold">
                                                {formatTime(firstSegment?.departureTime)}
                                                <span className="pl-2 text-xs">
                                                    {departureAirportObj?.iata}
                                                    {firstSegment?.departureTerminal
                                                        ? `, T${firstSegment?.departureTerminal}`
                                                        : ""}
                                                </span>
                                            </p>

                                            <p className="text-gray-500 text-xs">
                                                {departureAirportObj?.city} - {departureAirportObj?.name},{" "}
                                                {departureAirportObj?.country}
                                            </p>
                                        </Box>

                                        {/* DURATION & STOPS */}
                                        <Box className="flex-1 text-center">
                                            <div className="text-lg font-semibold">
                                                {formatDuration(fare?.duration)}
                                            </div>

                                            <p
                                                style={{
                                                    width: 60,
                                                    height: 5,
                                                    borderRadius: 8,
                                                    backgroundColor: "#1976d2",
                                                    margin: "6px auto"
                                                }}
                                            />

                                            <p
                                                className="cursor-pointer text-sm"
                                                onClick={(e) => openPopover(e, fare)}
                                            >
                                                {segments.length > 1
                                                    ? `${segments.length - 1} Stop`
                                                    : "Non Stop"}
                                            </p>
                                        </Box>

                                        {/* DESTINATION (FINAL, NOT CONNECTING) */}
                                        <Box className="flex-1 text-right">
                                            <p className="text-xl font-bold">
                                                {formatTime(lastSegment?.arrivalTime)}
                                                <span className="pl-2 text-xs">
                                                    {arrivalAirportObj?.iata}
                                                    {lastSegment?.arrivalTerminal
                                                        ? `, T${lastSegment?.arrivalTerminal}`
                                                        : ""}
                                                </span>
                                            </p>

                                            <p className="text-gray-500 text-xs">
                                                {arrivalAirportObj?.city} - {arrivalAirportObj?.name},{" "}
                                                {arrivalAirportObj?.country}
                                            </p>
                                        </Box>
                                    </Box>

                                    {/* Aircraft & Cabin Info */}
                                    <div className="text-gray-600 text-sm">
                                        {fare?.segments?.map((seg, idx) => (
                                            <span key={idx}>
                                                <FlightIcon /> {seg?.aircraftCode} • Cabin: {seg?.cabin}
                                                {idx < fare?.segments?.length - 1 && " | "}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price & Button */}
                                <div className="flex w-full items-center justify-between md:flex-col md:w-40 md:items-end mt-4 md:mt-0">
                                    <Box className="flex text-lg font-semibold items-center">
                                        ₹ {Math.floor(fare?.totalPrice)}
                                        <Typography className="text-sm pl-1">/ adult</Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        className="mt-2 px-5 py-2 transition"
                                        onClick={(e) => handleFlightSearch(e, fare)}
                                    >
                                        Select Flight
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
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