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
    Link
} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useBookingStore } from "store/bookingStore";
import { getAddons } from "../../apis/flights/addons";
import { getBookingDetails, updateAddonsInPassengers } from "../../apis/flights/booking";
import { getCheckinBookingDetails, updateCheckinAddonsInPassengers } from "../../apis/flights/checkin";
import TripSummary from "../../common/flights/tripSummary";

const AddonsPage = () => {
    const history = useHistory();
    const { addons, bookingDetails, checkinDetails } = useBookingStore();
    const [passengerAddons, setPassengerAddons] = useState([]);
    const isCheckin = history?.location?.pathname?.includes("/check-in/addons")

    const flowData = useMemo(() => {
        return isCheckin ? checkinDetails : bookingDetails;
    }, [isCheckin, bookingDetails, checkinDetails]);

    const {
        sourceAirport,
        destinationAirport,
        passengers = [],
        bookingId,
        priceBreakdown,
    } = flowData || {};

    const meals = useMemo(
        () => addons?.filter((a) => a.type === "meal") || [],
        [addons]
    );

    const baggages = useMemo(
        () => addons?.filter((a) => a.type === "baggage") || [],
        [addons]
    );

    useEffect(() => {
        if (!bookingDetails?.passengers?.length && !checkinDetails?.passengers?.length) return;
        if (isCheckin) setPassengerAddons(checkinDetails?.passengers);
        else setPassengerAddons(bookingDetails?.passengers);
    }, [bookingDetails?.passengers, checkinDetails?.passengers]);

    useEffect(() => {
        fetchAddons();
        if (isCheckin) {
            fetchCheckinBooking();
        } else {
            fetchBooking();
        }
    }, [])

    const fetchAddons = async () => {
        await getAddons();
    }

    const fetchBooking = async () => {
        await getBookingDetails();
    }

    const fetchCheckinBooking = async () => {
        await getCheckinBookingDetails();
    }

    const toggleAddon = (passengerId, addon) => {
        setPassengerAddons((prev) =>
            prev.map((p, index) => {
                if (index !== passengerId) return p;
                const exists = p?.addons?.some(a => a._id === addon._id);

                if (exists) {
                    return {
                        ...p,
                        addons: p?.addons?.filter(a => a._id !== addon._id),
                    };
                }
                return {
                    ...p,
                    addons: [
                        ...p?.addons?.filter(a => a.type !== addon.type),
                        addon,
                    ],
                };
            })
        );
    };



    const assemblePassengersWithAddons = () => {
        return passengerAddons?.map(p => ({
            ...p,
            addons: p?.addons?.map(a => a?._id),
        }));
    };

    const assemblePassengersWithCheckinAddons = () => {
        return passengerAddons?.map(p => ({
            ...p,
            addons: p?.addons?.map(a => a?._id),
            paidAddons: p?.paidAddons?.map(a => a?._id),
        }));
    };


    const handleSeatSelection = async () => {
        if (isCheckin) {
            const passengersWithAddons = assemblePassengersWithCheckinAddons();
            const response = await updateCheckinAddonsInPassengers({
                passengers: passengersWithAddons,
            });
            if (!response?.success) return;
            history.push("/check-in/seat-selection");
        } else {
            const passengersWithAddons = assemblePassengersWithAddons();
            const response = await updateAddonsInPassengers({
                bookingId: bookingId,
                passengers: passengersWithAddons,
            });
            if (!response?.success) return;
            history.push("/seat-selection");
        }
    }

    const sumAddonsPrice = items =>
        items?.reduce((s, i) => s + i.price, 0) || 0;

    const calculateAddonsPrice = () => {
        if (!isCheckin) {
            return passengerAddons?.reduce(
                (sum, p) => sum + sumAddonsPrice(p?.addons),
                0
            );
        }

        // check-in: charge only newly added addons
        return passengerAddons?.reduce((sum, p) => {
            const currentTotal = sumAddonsPrice(p?.addons);      // newly selected
            const paidTotal = sumAddonsPrice(p?.paidAddons);     // already paid

            return sum + Math.max(0, currentTotal - paidTotal);
        }, 0);
    };

    const addonsPrice = useMemo(() => {
        return calculateAddonsPrice();
    }, [passengerAddons]);


    const calculateCheckinDelta = () => {
        return passengerAddons?.reduce((total, p) => {
            const currentAddonsTotal = sumAddonsPrice(p?.addons);
            const paidAddonsTotal = sumAddonsPrice(p?.paidAddons);

            const delta = currentAddonsTotal - paidAddonsTotal;

            return total + Math.max(0, delta);
        }, 0);
    };

    const totalPrice = useMemo(() => {
        if (!isCheckin) {
            return passengerAddons?.reduce(
                (sum, p) =>
                    sum +
                    sumAddonsPrice(p?.addons) +
                    0
                , 0);
        }

        // ✅ CHECK-IN
        return calculateCheckinDelta();
    }, [passengerAddons, isCheckin]);

    const priceBreakdownDetails = useMemo(() => {
        if (!isCheckin) {
            const basePrice = priceBreakdown?.basePrice || 0;
            const taxes = priceBreakdown?.taxes || 0;
            return {
                basePrice,
                taxes,
                addonsPrice,
                totalPrice: basePrice + taxes + addonsPrice,
            }
        }
        return {
            addonsPrice: totalPrice,
            totalPrice: totalPrice,
        };
    }, [bookingDetails, addonsPrice, totalPrice]);

    return (
        <Box maxWidth="lg" mx="auto" p={2}>
            <Grid container spacing={3}>
                {/* LEFT */}
                <Grid item xs={12} md={8}>
                    <Box >
                        <Link href={isCheckin ? "/check-in" : "/passenger-edit"} sx={{
                            cursor: "pointer",
                            color: "#000",
                            textDecorationColor: "#000",
                            textUnderlineOffset: "4px",
                            "&:hover": {
                                textDecorationColor: "#000",
                            },
                        }}>
                            <KeyboardBackspaceIcon /> Back To {isCheckin ? "Check-in" : "Passengers Details"}
                        </Link>
                    </Box>
                    <Paper sx={{ my: 4, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
                        <Typography align="center" fontWeight="bold">
                            {sourceAirport?.city} to {destinationAirport?.city}
                        </Typography>
                    </Paper>
                    <Typography variant="h5" fontWeight={600} mb={2}>
                        Select Addons
                    </Typography>

                    <Stack spacing={3}>
                        {passengers?.map((p, passengerIndex) => {
                            const passengerAddon = passengerAddons?.[passengerIndex];
                            return (
                                <Card key={p.id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#f7fbff", p: 2 }}>
                                        <Box sx={{ width: 4, height: 48, bgcolor: "success.main", borderRadius: 1, mr: 2 }} />
                                        <Box>
                                            <Typography fontWeight={600}>{p?.title} {p.firstName} {p.lastName}
                                                <Typography variant="caption" color="text.secondary">
                                                    {" "}({p.gender})
                                                </Typography>
                                            </Typography>
                                            {p?.infantTagged ? <Typography variant="caption" color="text.secondary">
                                                Infant tagged: {p.infantTagged?.title} {p.infantTagged?.firstName}
                                            </Typography> : ""}
                                        </Box>

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
                                                                <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                    <Box display="flex" alignItems="center" >
                                                                        <Radio checked={added || false} />
                                                                        <Typography>{baggage.title}</Typography>
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography fontWeight={600}>
                                                                            ₹{baggage.price}
                                                                        </Typography>
                                                                    </Box>
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