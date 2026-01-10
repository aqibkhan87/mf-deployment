import React, { useState, useEffect } from "react";
import {
    Paper,
    TextField,
    Typography,
    Autocomplete,
    Box,
    Popper
} from "@mui/material";
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const CustomPopper = (props) => {
    const { style } = props;
    return (
        <Popper
            {...props}
            sx={{
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
        <Paper sx={{ width: "100%", borderRadius: 2, border: "1px solid #E0E0E0", p: 2, cursor: "pointer" }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>

            <Autocomplete
                fullWidth
                clearOnBlur={false}
                handleHomeEndKeys
                autoHighlight
                PopperComponent={CustomPopper}
                options={options || []}
                value={value}
                openOnFocus
                forcePopupIcon={false}
                inputValue={inputValue}
                filterOptions={(x) => x} // show all backend options
                onInputChange={(e, newInputValue) => {
                    onInputChange(newInputValue);
                }}
                onChange={(e, newValue) => onSelect(newValue)}
                getOptionLabel={(option) => option ? `${option.city}, ${option.iata}` : ""}
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
                        <Box display={"flex"}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <FmdGoodIcon sx={{ width: 32, height: 32 }} />
                            </Box>
                            <Box sx={{ pl: 1 }}>
                                <Typography variant="body1">{option.city}, {option.iata}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {option.name}{option.distanceInKm ? ` • ${Math.floor(option.distanceInKm)} Km` : ""}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            />

            <Typography variant="body2" color="text.secondary"
                sx={{ wordBreak: "break-word" }} className="ellipsis-35">
                {value?.name ? value?.name : "Select airport by place/city"}
            </Typography>
        </Paper>
    );
};

export default AirportSelector;
