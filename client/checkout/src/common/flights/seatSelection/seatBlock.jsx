import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { useBookingStore } from "store/bookingStore";
import Seat from "./seat";
import EconomySeat from "../../../assets/economy-seat.jpg";
import BusinessSeat from "../../../assets/business-seat.jpg";

const getSeatType = (column, columns, seatPricing, seatId, seatLayoutType) => {
    if (column === columns[0] || column === columns[columns.length - 1]) return {
        seatType: "window",
        price: seatPricing?.window,
        seatNumber: seatId,
        cabin: seatLayoutType,
    };
    const middleIndex = Math.floor(columns.length / 2);
    if (column === columns[middleIndex]) return {
        seatType: "middle",
        price: seatPricing?.middle,
        seatNumber: seatId,
        cabin: seatLayoutType,
    };
    return {
        seatType: "aisle",
        price: seatPricing?.aisle,
        seatNumber: seatId,
        cabin: seatLayoutType,
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
            {seatTypeWithPrice.cabin === "ECONOMY" && <img src={EconomySeat} height={100} width={150} />}
            {seatTypeWithPrice.cabin === "BUSINESS" && <img src={BusinessSeat} height={100} width={150} />}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                {status == "selected" && (
                    <Typography fontSize={12}>
                        {passengerName}
                    </Typography>
                )}
                <Typography fontSize={13}>
                    ₹{seatTypeWithPrice.price}
                </Typography>

            </Box>
        </Box>
    );
};


const SeatBlock = ({ layout, seatState, onSelect, seatLayoutType, activePassenger }) => {
    const { seatMap } = useBookingStore();
    const columns = layout?.columns || [];
    const rows = layout?.rows || 0;
    let seatPricing = {};

    if (seatLayoutType === "ECONOMY")
        seatPricing = seatMap?.seatLayout?.find(layout => layout.cabin === seatLayoutType)?.seatPricing || {};
    else if (seatLayoutType === "BUSINESS")
        seatPricing = seatMap?.seatLayout?.find(layout => layout.cabin === seatLayoutType)?.seatPricing || {};


    const RenderRows = () => {
        let rowMap = [];
        for (let row = 1; row <= rows; row++) {
            rowMap.push(
                <Box key={row} display="flex" gap={2} flexDirection="column" justifyContent="space-around">
                    {columns?.map((col, i) => {
                        const seatId = `${row}${col}`;
                        const status = seatState[seatId] || "available";
                        const gapAfter = Math.ceil((columns?.length / 2));
                        const seatTypeWithPrice = getSeatType(col, columns, seatPricing, seatId, seatLayoutType);

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
                                            activePassenger?.seat?.seatNumber === seatId ?
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