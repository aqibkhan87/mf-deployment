import React from "react";
import { Box } from "@mui/material";
import Seat from "./seat";

const ROWS = ["A", "B", "C", "D", "E", "F"];

const SeatBlock = ({ layout, seatState, onSelect }) => {
    const columns = layout?.columns || [];
    const rows = layout?.rows || 0;

    const RenderRows = () => {
        let rowMap = [];
        for (let row = 1; row <= rows; row++) {
            rowMap.push(
            <Box key={row} display="flex" gap={2} flexDirection="column" justifyContent="space-around">
                {columns?.map((col, i) => {
                    const seatId = `${row}${col}`;
                    const status = seatState[seatId] || "available";
                    const gapAfter = Math.ceil((columns?.length / 2));
                    return (
                        <Seat
                            key={i}
                            status={status}
                            seatId={seatId}
                            index={i}
                            onSelect={() => onSelect(seatId)}
                            gapAfter={gapAfter}
                        />
                    )
                })}
            </Box>)
        }
        return rowMap;
    }

    return (
        <Box display="flex" gap={2}>
            <RenderRows />
        </Box>
    )
};

export default SeatBlock;