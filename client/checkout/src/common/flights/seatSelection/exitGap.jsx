import React from "react";
import { Box, Chip } from "@mui/material";

const ExitGap = () => (
    <Box
        sx={{
            width: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
        }}
    >
        <Chip
            label="EXIT"
            sx={{
                mb: 1,
                px: 3,
                fontWeight: 700,
                borderRadius: "999px",
                backgroundColor: "aliceblue",
            }}
        />

        <Box
            sx={{
                flex: 1,
                borderLeft: "2px dashed #b3dbff",
            }}
        />

        <Chip
            label="EXIT"
            sx={{
                mt: 1,
                px: 3,
                fontWeight: 700,
                borderRadius: "999px",
                backgroundColor: "aliceblue",
            }}
        />
    </Box>
);

export default ExitGap;