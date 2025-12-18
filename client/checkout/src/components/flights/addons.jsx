import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Radio,
    Stack,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useBookingStore } from "store/bookingStore";
import { getAddons } from "../../apis/flights/addons";
import { getBookingDetails } from "../../apis/flights/booking";

const BASE_FARE = 25000;

export default function AddonsPage() {
    const theme = useTheme();
    const { addons, bookingDetails } = useBookingStore();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [selectedAddons, setSelectedAddons] = useState({});

    const meals = useMemo(
        () => addons?.filter((a) => a.type === "meal") || [],
        [addons]
    );

    const baggage = useMemo(
        () => addons?.filter((a) => a.type === "baggage") || [],
        [addons]
    );

    const passengers = bookingDetails?.passengers || [];
    const baseFare = bookingDetails?.baseFare || 0;


    useEffect(() => {
        if (!passengers.length) return;

        const init = {};
        passengers.forEach((p) => {
            init[p._id] = { meals: [], baggage: null, extras: [] };
        });

        setSelectedAddons(init);
    }, [passengers]);

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

    const toggleMeal = (pid, meal) => {
        setSelectedAddons((prev) => {
            const exists = prev[pid]?.meals?.find((m) => m._id === meal._id);
            return {
                ...prev,
                [pid]: {
                    ...prev[pid],
                    meals: exists
                        ? prev[pid]?.meals?.filter((m) => m._id !== meal._id)
                        : [...prev[pid].meals, meal],
                },
            };
        });
    };

    const setBaggage = (pid, bag) => {
        setSelectedAddons((prev) => ({
            ...prev,
            [pid]: { ...prev[pid], baggage: bag },
        }));
    };

    const addonsTotal = useMemo(() => {
        return Object.values(selectedAddons).reduce((sum, p) => {
            const mealTotal = p?.meals.reduce((s, m) => s + m.price, 0);
            const baggageTotal = p?.baggage?.price || 0;
            return sum + mealTotal + baggageTotal;
        }, 0);
    }, [selectedAddons]);

    const grandTotal = baseFare + addonsTotal;


    const handleSeatSelection = async () => {
        history.push("/seat-selection");
    }

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                {/* LEFT */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" fontWeight={600} mb={2}>
                        Select Add-ons
                    </Typography>

                    <Stack spacing={3}>
                        {passengers?.map((p) => {
                            const selected = selectedAddons[p?._id];

                            return (
                                <Grid key={p.id}>
                                    <CardContent>
                                        <Typography fontWeight={600}>{p.firstName} {p.lastName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {p.type}
                                        </Typography>
                                        <Box mt={3}>
                                            <Typography fontWeight={600} mb={1}>
                                                Meals
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {meals?.map((m) => {
                                                    const added = selected?.meals?.some((x) => x._id === m._id);
                                                    console.log("mmmmm", m)
                                                    return (
                                                        <Grid item xs={12} sm={6} key={m._id}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography fontWeight={600}>
                                                                        {m.title}
                                                                        <Chip size="small" label={m.tag} sx={{ ml: 1 }} />
                                                                    </Typography>
                                                                    <Typography variant="caption">{m.description}</Typography>
                                                                    <Typography fontWeight={600}>₹{m.price}</Typography>
                                                                    <Button
                                                                        fullWidth
                                                                        variant={added ? "contained" : "outlined"}
                                                                        onClick={() => toggleMeal(p._id, m)}
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
                                                {baggage?.map((b) => (
                                                    <Grid item xs={6} sm={4} key={b._id}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                cursor: "pointer",
                                                                borderColor:
                                                                    selected?.baggage?._id === b._id
                                                                        ? "primary.main"
                                                                        : "divider",
                                                            }}
                                                            onClick={() => setBaggage(p._id, b)}
                                                        >
                                                            <CardContent>
                                                                <Box display="flex" alignItems="center" >
                                                                    <Radio checked={selected?.baggage?._id === b._id} sx={{pl: 0}}/>
                                                                    <Typography>{b.title}</Typography>
                                                                </Box>
                                                                <Typography variant="caption">₹{b.price}</Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </CardContent>
                                </Grid>
                            );
                        })}
                    </Stack>
                </Grid>

                {/* RIGHT SUMMARY */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography fontWeight={600}>Trip Summary</Typography>
                            <Typography mt={2}>Base Fare: ₹{BASE_FARE}</Typography>
                            <Typography>Add-ons: ₹{addonsTotal}</Typography>
                            <Typography fontWeight={600} mt={1}>
                                Total: ₹{grandTotal}
                            </Typography>

                            {!isMobile && (
                                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSeatSelection}>
                                    Continue to Seat Selection
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
