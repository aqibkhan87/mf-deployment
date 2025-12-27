import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import Seat from "./seat";
import EconomySeat from "../../../assets/economy-seat.jpg";
import BusinessSeat from "../../../assets/business-seat.jpg";

const getGapAfter = (columns) => {
    if (columns?.length === 5 || columns?.length === 6) {
        return [2]
    } else if (columns?.length === 7) {
        return [1, 4]
    } else if (columns?.length === 8) {
        return [1, 5]
    } else if (columns?.length === 9) {
        return [1, 6]
    } else if (columns?.length === 4) {
        return [0,2]
    }
}
const getSeatType = (columns, seatPricing, seatId, seatLayoutType, index) => {
    const gaps = getGapAfter(columns)
    const isWindow =
        index === 0 || index === columns.length - 1;

    const isAisle =
        gaps.includes(index) || gaps.includes(index - 1);
    if (isWindow) return {
        seatType: "window",
        price: seatPricing?.window,
        seatNumber: seatId,
        cabin: seatLayoutType,
    };
    if (isAisle) return {
        cabin: seatLayoutType,
        seatType: "aisle",
        price: seatPricing?.aisle,
        seatNumber: seatId,
    };
    return {
        cabin: seatLayoutType,
        seatType: "middle",
        price: seatPricing?.middle,
        seatNumber: seatId,
    };
};

const SeatPreview = ({ seatId, status, seatTypeWithPrice, passengerName }) => {
    return (
        <Box width={150}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box >
                    <Typography fontWeight={600}>
                        {seatId} </Typography>
                </Box>

                <Typography fontSize={13}>
                    {seatTypeWithPrice.cabin === "ECONOMY" ? "Economy" : "Business"}
                </Typography>
            </Box>
            {seatTypeWithPrice.cabin === "ECONOMY" && <img src={EconomySeat} height={100} width={150} className="rounded-2xl" />}
            {seatTypeWithPrice.cabin === "BUSINESS" && <img src={BusinessSeat} height={100} width={150} className="rounded-2xl" />}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, mt: 2 }}>
                {status == "selected" && (
                    <Typography fontSize={12}>
                        {passengerName}
                    </Typography>
                )}
                <Typography fontSize={13} fontWeight={600}>
                    ₹{seatTypeWithPrice?.price}
                </Typography>
            </Box>
        </Box>
    );
};


const SeatBlock = ({ layout, seatState, onSelect, seatPricing = {}, seatLayoutType = "ECONOMY", activePassenger, flightKey }) => {
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
                        const gapAfter = getGapAfter(columns).includes(i);
                        const seatTypeWithPrice = getSeatType(columns, seatPricing, seatId, seatLayoutType, i);

                        return (
                            <Tooltip
                                // open={i == 0 && col === "A" && row === 1}
                                key={seatId}
                                placement="top"
                                arrow
                                title={
                                    <SeatPreview
                                        key={i}
                                        status={status}
                                        seatId={seatId}
                                        index={i}
                                        seatTypeWithPrice={seatTypeWithPrice}
                                        passengerName={
                                            activePassenger?.seats?.[flightKey]?.seatNumber === seatId ?
                                                activePassenger?.firstName + " " + activePassenger?.lastName :
                                                ""}
                                    />
                                }
                                slotProps={{
                                    tooltip: {
                                        sx: {
                                            background: "#fff",
                                            color: "#0f172a",
                                            borderRadius: 2,
                                            boxShadow: "0 12px 30px rgba(0,0,0,.18)",
                                            pointerEvents: "none",
                                        },
                                    },
                                }}
                            >
                                <Box display="inline-flex" key={i}>
                                    <Seat
                                        key={i}
                                        status={status}
                                        seatId={seatId}
                                        index={i}
                                        onSelect={() => onSelect(seatId, seatLayoutType, seatTypeWithPrice)}
                                        gapAfter={gapAfter}
                                        seatTypeWithPrice={seatTypeWithPrice}
                                    />
                                </Box>
                            </Tooltip>
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