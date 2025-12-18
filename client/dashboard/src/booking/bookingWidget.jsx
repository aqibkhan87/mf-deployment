import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  FormControl,
  CircularProgress,
  Typography,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { fetchAirports, searchAirports } from "./../apis/flights/booking";
import "./bookingWidget.scss";

const MAX_ADULTS = 9;
const MAX_INFANTS = 2;

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const BookingWidget = () => {
  const history = useHistory();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [departDate, setDepartDate] = useState(new Date().toISOString().split("T")[0]);
  const [passengers, setPassengers] = useState({
    adults: 1,
    infant: 0
  });
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAirports()
      .then((res) => {
        setFromOptions(res);
        setToOptions(res);
      })
      .catch(() => {
        setFromOptions([]);
        setToOptions([]);
      });
  }, []);

  const handleAirportSearch = async (q, type) => {
    if (!q || q.length < 2) return;
    setLoadingAirports(true);
    try {
      const results = await searchAirports(q);
      if (type === "from") setFromOptions(results?.queryResults || []);
      else setToOptions(results?.queryResults || []);
    } catch (err) {
      console.error("Airport search failed:", err);
    } finally {
      setLoadingAirports(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce(handleAirportSearch, 400), []);

  const handleSearch = async () => {
    if (!from || !to || !departDate) {
      alert("Please select From, To, and Departure date.");
      return;
    }
    localStorage.setItem("search-info", JSON.stringify({
      from: from.iata, to: to.iata, date: departDate,
      passengers: { adult: passengers.adults, infant: passengers.infant }
    }))
    history.push(`/flight-search`);
  };

  return (
    <Paper elevation={0} className="booking-widget">
      <Box sx={{ py: 8, px: 3 }}>
        <Grid container spacing={2} alignItems="center" className="inputs-row">
          {/* From */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={fromOptions}
              getOptionLabel={(opt) =>
                opt?.name
                  ? `${opt.name}, ${opt.city} ${opt.country} (${opt.iata})`
                  : ""
              }
              value={from}
              inputValue={fromInput}
              onInputChange={(_, val) => {
                setFromInput(val);
                debouncedSearch(val, "from");
              }}
              filterOptions={(x) => x}
              onChange={(_, val) => setFrom(val)}
              isOptionEqualToValue={(opt, val) => opt.iata === val.iata}
              loading={loadingAirports}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{option.name}</span>
                      <span style={{ fontSize: 13, color: "gray" }}>
                        {option.city}, {option.country}
                      </span>
                      <span style={{ fontSize: 13, color: "gray" }}>
                        {option?.distanceInKm
                          ? `${Math.round(option?.distanceInKm)} Km`
                          : ""}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{option.iata}</p>
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  placeholder="Search by place/airport"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAirports ? (
                          <CircularProgress color="inherit" size={18} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* To */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={toOptions}
              getOptionLabel={(opt) =>
                opt?.name
                  ? `${opt.name}, ${opt.city} ${opt.country} (${opt.iata})`
                  : ""
              }
              value={to}
              inputValue={toInput}
              onInputChange={(_, val) => {
                setToInput(val);
                debouncedSearch(val, "to");
              }}
              filterOptions={(x) => x}
              onChange={(_, val) => setTo(val)}
              isOptionEqualToValue={(opt, val) => opt.iata === val.iata}
              loading={loadingAirports}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{option.name}</span>
                      <span style={{ fontSize: 13, color: "gray" }}>
                        {option.city}, {option.country}
                      </span>
                      <span style={{ fontSize: 13, color: "gray" }}>
                        {option?.distanceInKm
                          ? `${Math.round(option?.distanceInKm)} Km`
                          : ""}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{option.iata}</p>
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To"
                  placeholder="Search by place/airport"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAirports ? (
                          <CircularProgress color="inherit" size={18} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Departure"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
            />
          </Grid>

          {/* Passengers */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel id="passengers-label">Passengers</InputLabel>

              <Select
                labelId="passengers-label"
                label="Passengers"
                value="passengers"
                displayEmpty
                renderValue={() =>
                  `${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}, 
                  ${passengers.infant} Infant${passengers.infant > 1 ? "s" : ""}`
                }
              >
                {/* ADULT */}
                <MenuItem disableRipple disableTouchRipple>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box>
                      <Typography fontWeight={600}>Adult</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Age 12+
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPassengers((p) => ({
                            ...p,
                            adults: Math.max(1, p.adults - 1),
                            infant: Math.min(p.infant, Math.max(0, p.adults - 1)),
                          }));
                        }}
                        disabled={passengers.adults <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <Typography width={20} textAlign="center">
                        {passengers.adults}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPassengers((p) => ({
                            ...p,
                            adults: Math.min(MAX_ADULTS, p.adults + 1),
                          }));
                        }}
                        disabled={passengers.adults >= MAX_ADULTS}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </MenuItem>

                {/* INFANT */}
                <MenuItem disableRipple disableTouchRipple>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box>
                      <Typography fontWeight={600}>Infant</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Below 2 years
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPassengers((p) => ({
                            ...p,
                            infant: Math.max(0, p.infant - 1),
                          }));
                        }}
                        disabled={passengers.infant <= 0}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <Typography width={20} textAlign="center">
                        {passengers.infant}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPassengers((p) => ({
                            ...p,
                            infant: Math.min(p.adults, p.infant + 1),
                          }));
                        }}
                        disabled={passengers.infant >= passengers.adults}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <div className="bottom-row">
              <Button
                variant="contained"
                className="search-btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default BookingWidget;
