import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Paper,
    Radio,
    Stack,
} from "@mui/material";
import { useBookingStore } from "store/bookingStore";
import { getAddons } from "../../apis/flights/addons";
import { getBookingDetails, updateAddonsInPassengers } from "../../apis/flights/booking";
import TripSummary from "./tripSummary";

function AddonsPage() {
    const history = useHistory();
    const { addons, bookingDetails } = useBookingStore();
    const [passengerAddons, setPassengerAddons] = useState([]);
    const segment = bookingDetails?.flightDetail?.segments?.[0];
    const sourceAirport= bookingDetails?.sourceAirport;
    const destinationAirport = bookingDetails?.destinationAirport;

    const meals = useMemo(
        () => addons?.filter((a) => a.type === "meal") || [],
        [addons]
    );

    const baggages = useMemo(
        () => addons?.filter((a) => a.type === "baggage") || [],
        [addons]
    );

    useEffect(() => {
        if (!bookingDetails?.passengers?.length) return;
        setPassengerAddons(bookingDetails?.passengers);
    }, [bookingDetails?.passengers]);

    useEffect(() => {
        fetchAddons();
        fetchBooking();
    }, [])

    const fetchAddons = async () => {
        await getAddons();
    }

    const fetchBooking = async () => {
        await getBookingDetails();
    }

    const toggleAddon = (passengerId, addon) => {
        setPassengerAddons((prev) =>
            prev.map((p, index) => {
                if (index !== passengerId) return p;
                const exists = p.addons.some(a => a._id === addon._id);

                if (exists) {
                    return {
                        ...p,
                        addons: p.addons.filter(a => a._id !== addon._id),
                    };
                }
                return {
                    ...p,
                    addons: [
                        ...p.addons.filter(a => a.type !== addon.type),
                        addon,
                    ],
                };
            })
        );
    };



    const assemblePassengersWithAddons = () => {
        return passengerAddons.map(p => ({
            ...p,
            addons: p.addons.map(a => a._id),
        }));
    };


    const handleSeatSelection = async () => {
        const passengersWithAddons = assemblePassengersWithAddons();
        const response = await updateAddonsInPassengers({
            bookingId: bookingDetails?.bookingId,
            passengers: passengersWithAddons,
        });
        if (!response?.success) return;
        history.push("/seat-selection");
    }

    const addonsPrice = useMemo(() => {
        return passengerAddons.reduce((sum, p) => {
            return (
                sum +
                p.addons.reduce((s, a) => s + (a.price || 0), 0)
            );
        }, 0);
    }, [passengerAddons]);

    const priceBreakdownDetails = useMemo(() => {
        const basePrice = bookingDetails?.priceBreakdown?.basePrice || 0;
        const taxes = bookingDetails?.priceBreakdown?.taxes || 0;
        return {
            basePrice,
            taxes,
            addonsPrice,
            finalPrice: basePrice + taxes + addonsPrice,
        }
    }, [bookingDetails, addonsPrice]);

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                {/* LEFT */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ my: 2, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
                        <Typography align="center" fontWeight="bold">
                            {sourceAirport?.city} to {destinationAirport?.city}
                        </Typography>
                    </Paper>
                    <Typography variant="h5" fontWeight={600} mb={2}>
                        Select Addons
                    </Typography>

                    <Stack spacing={3}>
                        {bookingDetails?.passengers?.map((p, passengerIndex) => {
                            const passengerAddon = passengerAddons[passengerIndex];

                            return (
                                <Card key={p.id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#f7fbff", p: 2 }}>
                                        <Box sx={{ width: 4, height: 48, bgcolor: "success.main", borderRadius: 1, mr: 2 }} />
                                        <Typography fontWeight={600}>{p.firstName} {p.lastName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {p.type}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 2 }}>
                                        <Box mt={3}>
                                            <Typography fontWeight={600} mb={1}>
                                                Meals
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {meals?.map((meal) => {
                                                    const added = passengerAddon?.addons?.some((x) => x._id === meal._id);
                                                    return (
                                                        <Grid item xs={12} sm={6} key={meal._id}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography fontWeight={600}>
                                                                        {meal.title}
                                                                        <Chip size="small" label={meal.tag} sx={{ ml: 1, bgcolor: "#f7fbff" }} />
                                                                    </Typography>
                                                                    <Typography variant="caption">{meal.description}</Typography>
                                                                    <Typography fontWeight={600}>₹{meal.price}</Typography>
                                                                    <Button
                                                                        fullWidth
                                                                        variant={added ? "contained" : "outlined"}
                                                                        onClick={() => toggleAddon(passengerIndex, meal)}
                                                                        sx={{ mt: 1 }}
                                                                    >
                                                                        {added ? "Added" : "Add"}
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Box>

                                        <Box mt={4}>
                                            <Typography fontWeight={600} mb={1}>
                                                Baggage
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {baggages?.map((baggage) => {
                                                    const added = passengerAddon?.addons?.some((x) => x._id === baggage._id);
                                                    return (
                                                        <Grid item xs={6} sm={4} key={baggage._id}>
                                                            <Card
                                                                variant="outlined"
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    borderColor:
                                                                        added
                                                                            ? "primary.main"
                                                                            : "divider",
                                                                }}
                                                                onClick={() => toggleAddon(passengerIndex, baggage)}
                                                            >
                                                                <CardContent>
                                                                    <Box display="flex" alignItems="center" >
                                                                        <Radio checked={added || false} sx={{ pl: 0 }} />
                                                                        <Typography>{baggage.title}</Typography>
                                                                    </Box>
                                                                    <Typography variant="caption">
                                                                        ₹{baggage.price}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Card>
                            );
                        })}
                    </Stack>
                </Grid>

                {/* RIGHT SUMMARY */}
                <Grid item xs={12} md={4}>
                    <TripSummary
                        segment={segment}
                        sourceAirport={bookingDetails?.sourceAirport}
                        destinationAirport={bookingDetails?.destinationAirport}
                        priceBreakdown={priceBreakdownDetails}
                    />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSeatSelection}>
                        Continue to Seat Selection
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddonsPage;