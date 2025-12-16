import React, { useState } from "react";
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
    Paper,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MEALS = [
    { id: "m-veg", title: "6E Eats (Veg)", desc: "Choice of the day + Beverage", price: 400, tag: "Veg" },
    { id: "m-nv", title: "6E Eats (Non-Veg)", desc: "Chicken Junglee Sandwich + Beverage", price: 500, tag: "Non Veg" },
];

const BAGGAGE = [
    { id: "bag-0", label: "No excess baggage", price: 0 },
    { id: "bag-3", label: "3 Kg", price: 1950 },
    { id: "bag-5", label: "5 Kg", price: 3150 },
];

const EXTRAS = [
    { id: "extra-piece", title: "Additional Piece", desc: "Extra baggage", price: 2500 },
    { id: "sports", title: "Sports Equipment", desc: "Sports handling", price: 1800 },
];

const PASSENGERS = [
    { id: "p1", name: "Aqib Khan", type: "adult" },
    { id: "p2", name: "Passenger 2", type: "adult" },
    { id: "p3", name: "Infant 1", type: "infant" },
];

const BASE_FARE = 25000;

export default function AddonsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [addons, setAddons] = useState(
        PASSENGERS.reduce((acc, p) => {
            acc[p.id] = { meals: [], baggage: null, extras: [] };
            return acc;
        }, {})
    );

    /* ------------------ HANDLERS ------------------ */

    const toggleMeal = (pid, meal) => {
        setAddons((prev) => {
            const exists = prev[pid].meals.find((m) => m.id === meal.id);
            return {
                ...prev,
                [pid]: {
                    ...prev[pid],
                    meals: exists
                        ? prev[pid].meals.filter((m) => m.id !== meal.id)
                        : [...prev[pid].meals, meal],
                },
            };
        });
    };

    const setBaggage = (pid, bag) => {
        setAddons((prev) => ({
            ...prev,
            [pid]: { ...prev[pid], baggage: bag },
        }));
    };

    const toggleExtra = (pid, extra) => {
        setAddons((prev) => {
            const exists = prev[pid].extras.find((e) => e.id === extra.id);
            return {
                ...prev,
                [pid]: {
                    ...prev[pid],
                    extras: exists
                        ? prev[pid].extras.filter((e) => e.id !== extra.id)
                        : [...prev[pid].extras, extra],
                },
            };
        });
    };

    /* ------------------ TOTALS ------------------ */

    const addonsTotal = Object.values(addons).reduce((sum, p) => {
        const meals = p.meals.reduce((s, m) => s + m.price, 0);
        const extras = p.extras.reduce((s, e) => s + e.price, 0);
        const baggage = p.baggage?.price || 0;
        return sum + meals + extras + baggage;
    }, 0);

    const grandTotal = BASE_FARE + addonsTotal;

    /* ------------------ UI ------------------ */


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
                } catch(err) {
                    console.log("errrrrrr", err);
                    debugger
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
            debugger
            alert("Payment failed");
        });

        rzp.open();
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
                        {PASSENGERS.map((p) => {
                            const selected = addons[p.id];

                            return (
                                <Card key={p.id} variant="outlined">
                                    <CardContent>
                                        <Typography fontWeight={600}>{p.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {p.type}
                                        </Typography>

                                        {/* MEALS */}
                                        <Box mt={3}>
                                            <Typography fontWeight={600} mb={1}>
                                                Meals
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {MEALS.map((m) => {
                                                    const added = selected.meals.some((x) => x.id === m.id);
                                                    return (
                                                        <Grid item xs={12} sm={6} key={m.id}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography fontWeight={600}>
                                                                        {m.title}
                                                                        <Chip size="small" label={m.tag} sx={{ ml: 1 }} />
                                                                    </Typography>
                                                                    <Typography variant="caption">{m.desc}</Typography>
                                                                    <Typography fontWeight={600}>₹{m.price}</Typography>
                                                                    <Button
                                                                        fullWidth
                                                                        variant={added ? "contained" : "outlined"}
                                                                        onClick={() => toggleMeal(p.id, m)}
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

                                        {/* BAGGAGE */}
                                        <Box mt={4}>
                                            <Typography fontWeight={600} mb={1}>
                                                Baggage
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {BAGGAGE.map((b) => (
                                                    <Grid item xs={6} sm={4} key={b.id}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                cursor: "pointer",
                                                                borderColor:
                                                                    selected.baggage?.id === b.id
                                                                        ? "primary.main"
                                                                        : "divider",
                                                            }}
                                                            onClick={() => setBaggage(p.id, b)}
                                                        >
                                                            <CardContent>
                                                                <Radio checked={selected.baggage?.id === b.id} />
                                                                <Typography>{b.label}</Typography>
                                                                <Typography variant="caption">₹{b.price}</Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>

                                        {/* EXTRAS */}
                                        <Box mt={4}>
                                            <Typography fontWeight={600} mb={1}>
                                                Extras
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {EXTRAS.map((ex) => {
                                                    const added = selected.extras.some((e) => e.id === ex.id);
                                                    return (
                                                        <Grid item xs={12} sm={6} key={ex.id}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography fontWeight={600}>{ex.title}</Typography>
                                                                    <Typography variant="caption">{ex.desc}</Typography>
                                                                    <Typography fontWeight={600}>₹{ex.price}</Typography>
                                                                    <Button
                                                                        fullWidth
                                                                        variant={added ? "contained" : "outlined"}
                                                                        onClick={() => toggleExtra(p.id, ex)}
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
                                    </CardContent>
                                </Card>
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
                                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handlePayment}>
                                    Continue to Payment
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* MOBILE STICKY CTA */}
            {isMobile && (
                <Paper
                    elevation={6}
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography fontWeight={600}>₹{grandTotal}</Typography>
                    <Button variant="contained">Proceed</Button>
                </Paper>
            )}
        </Box>
    );
}
