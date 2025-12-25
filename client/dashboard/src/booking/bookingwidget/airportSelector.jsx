import React, { useState, useEffect } from "react";
import {
    Paper,
    TextField,
    Typography,
    Autocomplete,
    Box,
    Popper
} from "@mui/material";

const CustomPopper = (props) => {
    const { style } = props;
    return (
        <Popper
            {...props}
            style={{
                ...style,
                width: 260, // 👈 OVERRIDES inline width
            }}
            placement="bottom-start"
            modifiers={[
                {
                    name: "offset",
                    options: {
                        offset: [-14, 40], // 👈 move dropdown down (vertical gap)
                    },
                },
            ]}
        />
    );
};

const AirportSelector = ({
    label,
    value,
    options,
    inputValue,
    onInputChange,
    onSelect,
    placeholder,
}) => {

    return (
        <Paper sx={{ width: "100%", borderRadius: 2, border: "1px solid #E0E0E0", p: 2 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>

            <Autocomplete
                fullWidth
                PopperComponent={CustomPopper}
                options={options || []}
                value={value}
                openOnFocus
                disableClearable
                forcePopupIcon={false}
                inputValue={inputValue}
                filterOptions={(x) => x} // show all backend options
                onInputChange={(e, newInputValue, reason) => {
                    onInputChange(newInputValue);
                }}
                onChange={(e, newValue) => onSelect(newValue)}
                getOptionLabel={(option) => option ? `${option.city} (${option.iata})` : ""}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder={placeholder}
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            sx: { color: "#1976d2", fontWeight: 500 },
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <Box>
                            <Typography variant="body1">{option.city} ({option.iata})</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {option.name}{option.distanceInKm ? ` • ${Math.floor(option.distanceInKm)} Km` : ""}
                            </Typography>
                        </Box>
                    </Box>
                )}
            />

            <Typography variant="body2" color="text.secondary"
                sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                {value?.name ? value?.name : "Select airport by place/city"}
            </Typography>
        </Paper>
    );
};

export default AirportSelector;
