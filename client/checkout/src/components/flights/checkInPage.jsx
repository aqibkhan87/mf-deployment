import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Divider,
    Grid,
    Avatar,
    Container,
    TextField,
    Button,
    Radio,
    Menu,
    MenuItem,
    ListItemText
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import DownloadIcon from "@mui/icons-material/Download";
import { useBookingStore } from "store/bookingStore";
import { getCheckinDetails, downloadBoardingPDF } from "../../apis/flights/checkin";
import {
    formatDate,
    formatTime,
    formatDuration,
    getTimeDifference,
    downloadFile
} from "../../utils/helper";


const CheckInPage = () => {
    const { checkinDetails } = useBookingStore();
    const history = useHistory();
    const params = new URLSearchParams(window.location.search);
    const PNR = params.get("PNR");
    const email = params.get("email");
    const bookingDetails = checkinDetails?.bookingDetails;
    const sourceAirport = bookingDetails?.sourceAirport;
    const destinationAirport = bookingDetails?.destinationAirport;
    const connectingAirports = bookingDetails?.connectingAirports;
    const segments = bookingDetails?.flightDetail?.segments;
    const passengers = bookingDetails?.passengers || [];
    const [selectedPassengers, setSelectedPassengers] = useState([]);
    const [menuState, setMenuState] = useState({
        anchorEl: null,
        passengerId: null,
    });

    const [formData, setFormData] = useState({
        PNR: "",
        emailOrLastName: ""
    });
    const [touched, setTouched] = useState({
        pnr: false,
        emailOrLastName: false
    });

    const looksLikeEmail = (val) =>
        typeof val === "string" && (val.includes("@") || val.includes("."));

    const isEmail = (str) => /\S+@\S+\.\S+/.test(str);

    const errors = {
        pnr: !formData.PNR,
        emailOrLastName: !formData.emailOrLastName,
    };

    const handleBlur = (field) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

    const handleSubmitCheckinForm = async (e) => {
        e?.preventDefault();
        await getCheckinDetails(formData)
    }

    useEffect(() => {
        if (PNR && email) getCheckinDetails({ PNR: PNR, emailOrLastName: email });
    }, [PNR, email])

    const handleFieldChange = (e, field) => {
        setFormData({ ...formData, [field]: e?.target?.value })
    }

    const handlePassengerSelect = (pId) => {
        if (selectedPassengers?.includes(pId)) {
            setSelectedPassengers(selectedPassengers?.filter(sp => sp !== pId))
        } else {
            setSelectedPassengers([...selectedPassengers, pId])
        }
    }

    const toggleAllPassengers = () => {
        if (selectedPassengers?.length === passengers?.length) {
            setSelectedPassengers([])
        } else {
            setSelectedPassengers(Array.from({ length: passengers?.length }, (_, i) => passengers?.[i]?.id))
        }
    }

    const handleWebCheck = () => {
        localStorage.setItem("bookingId", JSON.stringify(bookingDetails?.bookingId))
        if (selectedPassengers?.length === passengers?.length) {
            localStorage.setItem("isAll", JSON.stringify(true))
            localStorage.setItem("c_p", JSON.stringify(selectedPassengers))
        }
        else {
            localStorage.setItem("isAll", JSON.stringify(false))
            localStorage.setItem("c_p", JSON.stringify(selectedPassengers))
        }
        history.push(`/check-in/addons`)
    }

    return (
        <Container sx={{ py: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Box>
                        <Box sx={{ p: 2 }}>
                            <Typography fontWeight={600} fontSize={24}>
                                Find your booking
                            </Typography>
                            <Typography fontSize={16}>
                                Enjoy free online check-in from 48 hours up to 60 minutes before departure.
                            </Typography>
                        </Box>
                        <Paper sx={{ p: 4 }}>
                            <Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    sx={{ mb: 2, bgcolor: "white" }}
                                    label="Enter PNR"
                                    name="pnr"
                                    value={formData?.PNR}
                                    onChange={(e) => handleFieldChange(e, "PNR")}
                                    onBlur={() => handleBlur("pnr")}
                                    error={errors.pnr && touched.pnr}
                                    helperText={
                                        touched.pnr && errors.pnr
                                            ? "PNR length must be 6 alphanumeric characters."
                                            : ""
                                    }
                                />
                            </Box>
                            <Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    sx={{ mb: 2, bgcolor: "white" }}
                                    label="Enter email or Last Name"
                                    name="Email Or LastName"
                                    value={formData?.emailOrLastName}
                                    onChange={(e) => handleFieldChange(e, "emailOrLastName")}
                                    onBlur={() => handleBlur("emailOrLastName")}
                                    error={errors.emailOrLastName && touched.emailOrLastName}
                                    helperText={
                                        touched.emailOrLastName
                                            ? looksLikeEmail(formData?.emailOrLastName) &&
                                                !isEmail(formData?.emailOrLastName)
                                                ? "Invalid email address entered"
                                                : errors.emailOrLastName
                                                    ? "Enter valid last name"
                                                    : ""
                                            : ""
                                    }
                                />
                            </Box>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitCheckinForm}
                                aria-label="Web Check-in"
                                role="button"
                                tabIndex={0}
                            >
                                Web Check-in
                            </Button>
                        </Paper>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    {bookingDetails ?
                        <Box sx={{ py: 2 }}>
                            <Paper sx={{ my: 4, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
                                <Typography align="center" fontWeight="bold">
                                    {sourceAirport?.city} to {destinationAirport?.city}
                                </Typography>
                            </Paper>
                            <Paper>
                                <Box sx={{ bgcolor: "#EEF7FF", mb: 2, display: "flex", justifyContent: "space-between", p: 2 }}>
                                    <Box>{formatDate(bookingDetails?.date)}</Box>
                                    <Box>PNR: {checkinDetails?.PNR}</Box>
                                </Box>
                                <Box sx={{ p: 2 }}>
                                    {segments?.map((segment, index) => {
                                        const departureAirportObj = connectingAirports?.find(a => a?.iata === segment?.departureAirport);
                                        const arrivalAirportObj = connectingAirports?.find(a => a?.iata === segment?.arrivalAirport);
                                        let arrivalTime = segments?.length > 1 ? segments[index - 1]?.arrivalTime : ""
                                        return (
                                            <Box key={index}>
                                                {arrivalTime &&
                                                    <Box className="flex justify-center py-6">
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
                                                                {departureAirportObj?.iata}{segment?.departureTerminal ? `, T${segment?.departureTerminal}` : ""}
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
                                                        <p style={{
                                                            width: 60,
                                                            height: 5,
                                                            borderRadius: 8,
                                                            backgroundColor: "#1976d2",
                                                            margin: "6px auto"
                                                        }}></p>
                                                    </Box>
                                                    <Box className="flex-1">
                                                        <p className="text-xl font-bold">
                                                            {formatTime(segment?.arrivalTime)}
                                                            <span className="pl-2 text-xs">
                                                                {arrivalAirportObj?.iata}{segment?.arrivalTerminal ? `, T${segment?.arrivalTerminal}` : ""}
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
                                    <Box className="text-gray-600 text-sm" sx={{ mt: 3 }}>
                                        {segments?.map((seg, idx) => (
                                            <span key={idx}>
                                                <FlightIcon /> {seg?.aircraftCode} • Cabin: {seg?.cabin}
                                                {idx < segments?.length - 1 && " | "}
                                            </span>
                                        ))}
                                    </Box>
                                    <Divider sx={{ my: 4 }} />
                                    <Box
                                        className="text-gray-600 text-sm"
                                        sx={{ mt: 3, bgcolor: "#EEF7FF", p: 2, textAlign: "center", borderRadius: 2 }}
                                    >
                                        <Typography>
                                            web check-in
                                        </Typography>
                                        <Typography>
                                            web check-in window for your flight is now open
                                        </Typography>
                                    </Box>
                                    <Box className="text-gray-600 text-sm" sx={{ mt: 3, border: "1px solid #EEF7FF", borderRadius: 2 }}>
                                        <Box sx={{
                                            bgcolor: "#EEF7FF",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            p: 2,
                                            pr: 0
                                        }}>
                                            <Box>
                                                <Typography>
                                                    Select passengers for web check-in
                                                </Typography>
                                            </Box>
                                            <Box>
                                                {passengers?.length ?
                                                    passengers?.find((p) => p?.checkinAmount?.isPaid) ?
                                                        "" :
                                                        <Radio
                                                            checked={selectedPassengers?.length === passengers?.length}
                                                            onClick={toggleAllPassengers}
                                                        />
                                                    : ""}
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Box sx={{ display: "block" }}>
                                                {passengers?.map((p, i) => {
                                                    return (
                                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Box sx={{ display: "flex", p: 2, alignItems: "center" }}>
                                                                <Avatar />
                                                                <Box sx={{ pl: 2 }}>
                                                                    {p?.title} {p?.firstName} {p?.lastName}
                                                                </Box>
                                                            </Box>
                                                            <Box>
                                                                {p?.checkinAmount?.isPaid ?
                                                                    <>
                                                                        <Button
                                                                            variant="contained"
                                                                            startIcon={<DownloadIcon />}
                                                                            onClick={(e) =>
                                                                                setMenuState({
                                                                                    anchorEl: e.currentTarget,
                                                                                    passengerId: p.id,
                                                                                })
                                                                            }
                                                                        >
                                                                            Download Boarding Pass
                                                                        </Button>
                                                                        <Menu
                                                                            anchorEl={menuState.anchorEl}
                                                                            open={menuState.passengerId === p.id}
                                                                            onClose={() => setMenuState({ anchorEl: null, passengerId: null })}
                                                                        >
                                                                            {p?.boardingPasses?.map((bp, idx) => {
                                                                                return (
                                                                                    <MenuItem
                                                                                        key={idx}
                                                                                        onClick={() => {
                                                                                            downloadFile(bp.pdfURL);
                                                                                            setMenuState({ anchorEl: null, passengerId: null });
                                                                                        }}
                                                                                    >
                                                                                        <ListItemText
                                                                                            primary={`${bp.departureAirport} → ${bp.arrivalAirport}`}
                                                                                        />
                                                                                    </MenuItem>
                                                                                )
                                                                            })}
                                                                        </Menu>
                                                                    </>
                                                                    :
                                                                    <Radio
                                                                        checked={selectedPassengers.includes(p?.id) || false}
                                                                        onClick={() => handlePassengerSelect(p?.id)}
                                                                    />
                                                                }
                                                            </Box>
                                                        </Box>
                                                    )
                                                })}
                                            </Box>
                                            <Box sx={{ my: 2, p: 2 }}>
                                                <Button
                                                    fullWidth
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={selectedPassengers?.length === 0}
                                                    onClick={handleWebCheck}
                                                >
                                                    Check - in
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                        : <Box sx={{ py: 2 }}>
                            <Typography fontWeight={600} sx={{ mb: 3 }} fontSize={24}>
                                How to Web Check-In
                            </Typography>
                            <Paper sx={{ p: 3 }}>
                                <Box>
                                    <Typography fontWeight={600} sx={{ py: 2 }}>
                                        Passengers can complete web check-in during the following time windows:
                                    </Typography>
                                    <Typography>
                                        Domestic flights: From 48 hours to 60 minutes before departure
                                    </Typography>
                                    <Typography>
                                        International flights: From 24 hours to 75 minutes before departure
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography fontWeight={600} sx={{ py: 2 }}>
                                        For those checking in at the airport:
                                    </Typography>
                                    <Typography>
                                        Domestic flights: Counter check-in is available up to 60 minutes before departure
                                    </Typography>
                                    <Typography>
                                        International flights: Counter check-in is available up to 75 minutes before departure
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>}
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckInPage;
