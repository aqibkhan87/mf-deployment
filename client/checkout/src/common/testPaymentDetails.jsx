import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    Divider,
    Stack
} from "@mui/material";

const dummyData = {
    visa: {
        label: "Visa (Domestic)",
        number: "4854 9806 0470 8430",
        expiry: "Any Future Date",
        cvv: "Random CVV"
    },
    mastercard: {
        label: "Mastercard (Domestic)",
        number: "2305 3242 5784 8228",
        expiry: "Any Future Date",
        cvv: "Random CVV"
    },
    wallet: {
        label: "No Details Required for wallet",
    },
    upi_success: {
        label: "UPI (Success)",
        upi: "success@razorpay"
    },
    upi_failure: {
        label: "UPI (Failure)",
        upi: "failure@razorpay"
    }
};

const TestPaymentDisplay = () => {
    const [selected, setSelected] = useState("");

    const data = dummyData[selected];

    return (
        <Card sx={{ maxWidth: 420, borderRadius: 2, mt: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    Test Payment Details
                </Typography>

                <Typography variant="caption" color="error">
                    ⚠ TEST MODE ONLY
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Select
                    fullWidth
                    value={selected}
                    displayEmpty
                    onChange={(e) => setSelected(e.target.value)}
                >
                    <MenuItem value="">Select Method</MenuItem>
                    <MenuItem value="visa">Visa (Domestic)</MenuItem>
                    <MenuItem value="mastercard">Mastercard (Domestic)</MenuItem>
                    <MenuItem value="upi_success">UPI – Success</MenuItem>
                    <MenuItem value="upi_failure">UPI – Failure</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                </Select>

                {data && (
                    <Box mt={3}>
                        <Typography variant="subtitle1">
                            {data.label}
                        </Typography>

                        <Stack spacing={1} mt={1}>
                            {data.number && (
                                <Typography>
                                    <strong>Card Number:</strong> {data.number}
                                </Typography>
                            )}
                            {data.expiry && (
                                <Typography>
                                    <strong>Expiry:</strong> {data.expiry}
                                </Typography>
                            )}
                            {data.cvv && (
                                <Typography>
                                    <strong>CVV:</strong> {data.cvv}
                                </Typography>
                            )}
                            {data.upi && (
                                <Typography>
                                    <strong>UPI ID:</strong> {data.upi}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default TestPaymentDisplay;