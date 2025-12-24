import React from "react";
import { Box } from "@mui/material";

const Seat = ({ seatId, status, index, onSelect, gapAfter = 3, seatTypeWithPrice }) => {
    const styles = {
        available: {
            bg: "#fff",
            border: "#8ec5ff",
            color: "#1976d2",
            cursor: "pointer",
        },
        selected: {
            bg: "#cfe9ff",
            border: "#2196f3",
            color: "#0d47a1",
        },
        reserved: {
            bg: "#ffd6d6",
            border: "#f44336",
            color: "#b71c1c",
            cursor: "not-allowed",
        },
    };
    return (
        <Box
            onClick={status !== "reserved" ? onSelect : undefined}
            sx={{
                width: 30,
                height: 30,
                marginBottom: (index + 1) === gapAfter ? 2 : 0,
                borderRadius: 2,
                border: `2px solid ${styles[status].border}`,
                backgroundColor: `${styles[status].bg} !important`,
                color: styles[status].color,
                fontWeight: 600,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                cursor: styles[status].cursor || "pointer",
                "&:hover": status === "available"
                    ? { transform: "scale(1.05)" }
                    : {},
            }}

        >
            {seatId}
        </Box>
    )
};

export default Seat;