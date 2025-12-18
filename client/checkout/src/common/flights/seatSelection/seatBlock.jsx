import React from "react";
import { Box } from "@mui/material";
import Seat from "./seat";

const ROWS = ["A", "B", "C", "D", "E", "F"];

const SeatBlock = ({ columns, seatState, onSelect }) => (
    <Box display="flex" gap={2}>
        {columns.map((col) => (
            <Box key={col} display="flex" flexDirection="column" gap={2}>
                {ROWS.map((row, i) => {
                    const seatId = `${col}${row}`;
                    const status = seatState[seatId] || "available";
                    return (
                        <Seat
                            key={row}
                            status={status}
                            seatId={seatId}
                            index={i}
                            onSelect={() => onSelect(seatId)}
                        />
                    )
                })}
            </Box>
        ))}
    </Box>
);

export default SeatBlock;