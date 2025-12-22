import React from "react";
import {
    Box,
    Paper,
    TextField,
    Typography,
    Popover,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";

const AirportSelector = ({
    label,
    value,
    options,
    anchorEl,
    inputValue,
    onOpen,
    onClose,
    onInputChange,
    onSelect,
    placeholder
}) => (
    <Paper sx={{ borderRadius: "8px", border: "1px solid #E0E0E0", p: 2 }}>
        <Box onClick={onOpen} sx={{ cursor: "pointer" }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h6" color={"#1976d2"}>
                {value ? `${value.city}, ${value.iata}` : `${label === "from" ? "Select Deperature City" : "Select Destination"}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
                {value?.name ? value?.name : "Select airport by place/city"}
            </Typography>
        </Box>

        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Box p={1}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                />
            </Box>
            <List>
                {options?.map((item) => (
                    <ListItemButton
                        key={item?.iata}
                        selected={item?.iata === value?.iata}
                        onClick={() => onSelect(item)}
                    >
                        <ListItemText
                            primary={`${item?.city} (${item?.iata})`}
                            secondary={`${item?.name} ${item?.distanceInKm ? `${Math.floor(item?.distanceInKm)} Km` : ""}`}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Popover>
    </Paper>
);

export default AirportSelector;