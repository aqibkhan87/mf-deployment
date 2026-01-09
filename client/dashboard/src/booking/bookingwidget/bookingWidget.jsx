import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  Link,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack,
  IconButton
} from "@mui/material";
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import FlightIcon from "@mui/icons-material/Flight";
import dayjs from "dayjs";
import { fetchAirports, searchAirports } from "../../apis/flights/booking";
import { debounce, numberStyle } from "../../utils/helper";
import AirportSelector from "./airportSelector";
import DateSelector from "./dateSelector";
import "./bookingWidget.scss";
import { useBookingStore } from "store/bookingStore";
import { eventEmitter } from "../../utils/helper";

const PillSelector = ({ values, selected, onSelect, disabledRange }) => (
  <Stack direction="row" spacing={1}>
    {values?.map((val) => (
      <Button
        key={val}
        sx={numberStyle(val === selected)}
        onClick={() => onSelect(val)}
        disabled={disabledRange && (disabledRange >= val ? false : true)}
      >
        {val}
      </Button>
    ))}
  </Stack>
)

const TravellerPopOver = ({ onApply, passengers }) => {
  const adult = passengers?.adult;
  const infant = passengers?.adult > passengers.infant ?? passengers?.adult;

  return (
    <Paper sx={{ p: 3, width: 560, borderRadius: "16px" }}>
      <Box mb={3}>
        <Typography fontWeight={700}>ADULTS (12y+)</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          on the day of travel
        </Typography>
        <PillSelector
          values={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          selected={adult}
          onSelect={(adu) => onApply({ ...passengers, adult: adu })}
        />
      </Box>

      <Box mb={3}>
        <Typography fontWeight={700}>INFANTS (below 2y)</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          on the day of travel
        </Typography>
        <PillSelector
          values={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          disabledRange={passengers?.adult}
          selected={infant}
          onSelect={(inf) => onApply({ ...passengers, infant: inf })}
        />
      </Box>
    </Paper>
  )
}

const BookingWidget = () => {
  const PAGE_TYPE = document.querySelector("[data-page-type]")?.dataset?.pageType;
  const { searchEditing } = useBookingStore();
  const history = useHistory();
  const [anchors, setAnchors] = useState({
    passengerAnchor: null,
    dateAnchor: null,
  });

  const [from, setFrom] = useState({
    city: "New Delhi",
    coords: [28.55563, 77.09519],
    country: "IN",
    iata: "DEL",
    icao: "VIDP",
    name: "Indira Gandhi International Airport"
  });
  const [to, setTo] = useState({
    city: "Mumbai",
    coords: [19.08956, 72.86561],
    country: "IN",
    iata: "BOM",
    icao: "VABB",
    name: "Chhatrapati Shivaji Maharaj International Airport"
  });
  const [departDate, setDepartDate] = useState(new Date().toISOString().split("T")[0]);
  const [passengers, setPassengers] = useState({
    adult: 1,
    infant: 0
  });
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [tripType, setTripType] = useState("one-way");

  const searchDisabled = useMemo(() => {
    if (to && from && departDate && passengers) {
      return false;
    } else return true;
  }, [to, from, departDate, passengers])

  useEffect(() => {
    const handler = async (event) => {
      const payload = event.detail;
      if (payload) {
        setFrom(payload?.from);
        setTo(payload?.to);
        setDepartDate(payload?.date);
        setPassengers(payload?.passengers)
      }
    };
    window.addEventListener("UpdateSearchInBooking", handler);
    return () => {
      window.removeEventListener("UpdateSearchInBooking", handler);
    };
  }, []);

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
    try {
      const results = await searchAirports(q?.split(",")[0]);
      if (type === "from") setFromOptions(results?.queryResults || []);
      else setToOptions(results?.queryResults || []);
    } catch (err) {
      console.error("Airport search failed:", err);
    }
  };

  const debouncedFromSearch = useMemo(() => debounce(handleAirportSearch, 400), []);
  const debouncedToSearch = useMemo(() => debounce(handleAirportSearch, 400), []);

  const handleSearch = async () => {
    if (!from || !to || !departDate) {
      alert("Please select From, To, and Departure date.");
      return;
    }
    const payload = {
      from: from.iata, to: to.iata, date: departDate,
      passengers: { adult: passengers.adult, infant: passengers.infant }
    }
    localStorage.setItem("search-info", JSON.stringify(payload))
    if (!searchEditing) history.push(`/flight-search`);
    else if (searchEditing) {
      const eventData = { searchUpdated: true, ...payload };
      eventEmitter("SearchUpdated", eventData)
    }
  };

  const handleTripType = (e) => {
    setTripType(e.target.value);
  }

  const handleSwitch = (e) => {
    e?.preventDefault()
    setTo(from);
    setFrom(to);
    setFromInput(toInput)
    setToInput(fromInput)
  }

  return (
    <Box className="booking-widget">
      <Paper elevation={0} className="booking-widget-container">
        <Box sx={{ pb: 4, pt: 3, px: 3 }}>
          <Box sx={{ display: "flex" }}>
            <Grid item xs={12} md={3} mb={2}>
              <FormControl>
                <RadioGroup
                  value={tripType}
                  onChange={handleTripType}
                  row // optional: makes them horizontal
                >
                  <FormControlLabel
                    value="one-way"
                    control={<Radio />}
                    label="One Way"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Box>
          <Grid container spacing={2} alignItems="center" className="inputs-row">
            <Grid item xs={12} md={3} className="item-card block! md:flex! items-center"
              sx={{ position: "relative" }}>
              <AirportSelector
                label="From"
                value={from}
                placeholder="Select Source City"
                options={fromOptions}
                inputValue={fromInput}
                onInputChange={(v) => {
                  setFromInput(v);
                  debouncedFromSearch(v, "from");
                }}
                onSelect={(v) => {
                  setFrom(v);
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleSwitch} sx={{
                  right: -26,
                  top: 60,
                  position: { xs: "static", md: "absolute" },
                  margin: "auto",
                  paddingTop: { xs: 2, md: 0 },
                  paddingBottom: { xs: 0, }
                }}>
                  <SyncAltIcon sx={{
                    fontSize: "20px",
                    transform: { xs: "rotate(90deg)", md: "rotate(0deg)" }, // rotate the icon
                    color: "#1976d2",
                  }} />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={3} className="item-card">
              <AirportSelector
                label="To"
                placeholder="Select Destination City"
                value={to}
                options={toOptions}
                inputValue={toInput}
                onInputChange={(v) => {
                  setToInput(v);
                  debouncedToSearch(v, "to");
                }}
                onSelect={(v) => {
                  setTo(v);
                }}
              />
            </Grid>
            {/* Dates */}
            <Grid item xs={12} md={3} className="item-card">
              <Paper sx={{
                borderRadius: "8px",
                border: "1px solid #E0E0E0",
                backgroundColor: "#fff"
              }}>
                <Grid container alignItems="center" sx={{ padding: 2 }} onClick={(e) =>
                  setAnchors({ ...anchors, dateAnchor: e.currentTarget })
                } className="date-selector">
                  <Grid item >
                    <Typography variant="caption" color="text.secondary">
                      Departure Date
                    </Typography>
                    <Typography variant="h6" color="#1976d2">
                      {dayjs(departDate).format("DD MMM YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              {/* DATE POPOVER */}
              <Popover
                open={Boolean(anchors.dateAnchor)}
                anchorEl={anchors.dateAnchor}
                onClose={() =>
                  setAnchors({ ...anchors, dateAnchor: null })
                }
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                  sx: { width: 320, borderRadius: "12px", mt: 1, p: 2 },
                }}
              >
                <DateSelector
                  label="Departure Date"
                  value={departDate}
                  minDate={new Date().toISOString().split("T")[0]}
                  onChange={(date) => {
                    setDepartDate(date);
                    setAnchors({ ...anchors, dateAnchor: null });
                  }}
                />
              </Popover>
            </Grid>
            {/* Passengers */}
            <Grid item xs={12} md={3} className="item-card">
              <Paper sx={{
                borderRadius: "8px",
                border: "1px solid #E0E0E0",
                backgroundColor: "#fff",
              }}
                className="passenger-selector"
              >
                <Grid container alignItems="center" >
                  <Grid
                    item
                    onClick={(e) => setAnchors({ ...anchors, passengerAnchor: e.currentTarget })}
                    sx={{
                      cursor: "pointer",
                      p: 2
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Passenger
                    </Typography>
                    <Typography variant="h6" color={"#1976d2"}>
                      {`${passengers?.adult > 1 ? `${passengers?.adult} Adults` : `${passengers?.adult} Adult`}`} {`${passengers?.infant ? `, ${passengers?.infant} Infant` : ""}`}
                    </Typography>
                  </Grid>
                </Grid>
                {/* PASSENGER POPOVER */}
                <Popover
                  open={Boolean(anchors.passengerAnchor)}
                  anchorEl={anchors.passengerAnchor}
                  onClose={() => setAnchors({ ...anchors, passengerAnchor: null })}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  PaperProps={{
                    sx: { width: 360, borderRadius: "12px", mt: 1 }
                  }}
                >
                  <TravellerPopOver onApply={(data) => {
                    setPassengers(data);
                    setAnchors({ ...anchors, passengerAnchor: null });
                  }} passengers={passengers} />
                </Popover>
              </Paper>
            </Grid>

          </Grid>
        </Box>
        <Box sx={{ pb: 4, px: 3, display: "flex", justifyContent: "flex-end" }}>
          <Grid item xs={12} md={3}>
            <div className="bottom-row">
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ px: 2 }}
                disabled={searchDisabled}
              >
                {searchEditing ? "Modify" : "Search"}
              </Button>
            </div>
          </Grid>
        </Box>
      </Paper>
      {PAGE_TYPE === "dashboard" &&
        <Paper className="destination-container">
          <Box>
            <Link href="/destination"
              sx={{
                textDecorationLine: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
              <Box>
                <Typography>
                  Operating Routes
                </Typography>
                <Typography color="text.secondary">
                  Find flights at lowest fare
                </Typography>
              </Box>
              <Box>
                <FlightIcon />
              </Box>
            </Link>
          </Box>
        </Paper>}
    </Box>
  );
};

export default BookingWidget;
