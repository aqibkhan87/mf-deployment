import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  IconButton,
  Container,
  Paper,
  Link,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { createBooking } from "../../apis/flights/booking";
import { searchFlights } from "../../apis/flights/searchflight";
import { useBookingStore } from "store/bookingStore";
import { isEmailValid, isMobileValid } from "../../utils/helper";
import TripSummary from "./tripSummary";


const createPassenger = (type) => {
  const passenger = {
    type, // "adult" or "infant" or "child later" 
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    taggedTo: null,
    id: crypto.randomUUID()
  }
  if (type === "adult") {
    passenger.infantTagged = null; // or [] if you want multiple links
  }

  return passenger;
};

const isPassengerValid = (p) => {
  if (!p.firstName || !p.lastName || !p.gender) return false;
  if (p.type === "infant") {
    if (!p.dob || !p.taggedTo) return false;
    const dobDate = new Date(p.dob);
    const depDate = new Date();
    const ageInYears = (depDate - dobDate) / (1000 * 60 * 60 * 24 * 365);
    if (ageInYears > 2) return false; // Infant cannot be older than 2
  }
  return true;
};

function PassengerDetailsPage() {
  const history = useHistory();
  const { selectedFlight, sourceAirport, destinationAirport } = useBookingStore();
  const searchInfo = JSON.parse(sessionStorage.getItem("selectedFlight") || "{}");
  const { from, to, date: departDate, passengers: paxObj, providerId, flightId } = searchInfo;
  const adults = paxObj?.adult || 0;
  const infants = paxObj?.infant || 0;
  const [selectedPassenger, setSelectedPassenger] = useState(0);

  const [passengers, setPassengers] = useState(() => [
    ...Array.from({ length: adults }, (_, i) => createPassenger("adult", i === 0)),
    ...Array.from({ length: infants }, (_, i) => createPassenger("infant")),
  ]);
  const [contact, setContact] = useState({ email: "", mobile: "" });


  useEffect(() => {
    fetchFlight();
  }, []);

  const fetchFlight = async () => {
    await searchFlights({ from, to, date: departDate, providerId, flightId });
  };

  const toggleCard = (idx) => {
    setSelectedPassenger(idx);
  };

  const updatePassenger = (idx, field, value) => {
    setPassengers((prev) => {
      let updated = prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p));
      if (updated[idx]?.type === "infant" && field === "taggedTo") {
        return updated?.map((updateAdult) => {
          if (updateAdult?.id === value) {
            updateAdult.infantTagged = updated[idx];
            return updateAdult;
          }
          return updateAdult
        })
      }
      return updated;
    }
    );
  };

  const isFormValid = useMemo(() => passengers.every(isPassengerValid) && isEmailValid(contact.email) && isMobileValid(contact.mobile), [passengers, contact]);

  const handleNext = async () => {
    const adultsWithInfants = passengers?.filter((p) => p?.type === "adult")?.map((adult) => ({
      ...adult,
      infantTagged: passengers.find(child => child?.type === "infant" && child?.taggedTo === adult?.id)
    }));
    debugger
    const payload = {
      flightDetail: selectedFlight?.fare,
      connectingAirports: selectedFlight?.connectingAirports,
      providerId,
      date: departDate,
      passengers: adultsWithInfants,
      contact,
      sourceIATA: from,
      destinationIATA: to
    };
    const response = await createBooking(payload);
    if (response?.bookingId) {
      history.push("/addons");
    }
  };

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  console.log("passengerspassengers", passengers)

  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid item xs={12} md={8}>
          <Box >
            <Link href="/flight-search" sx={{
              cursor: "pointer",
              color: "#000",
              textDecorationColor: "#000",
              textUnderlineOffset: "4px",
              "&:hover": {
                textDecorationColor: "#000",
              },
            }}>
              <KeyboardBackspaceIcon /> Back To Search Flight
            </Link>
          </Box>
          <Paper sx={{ my: 4, p: 2, textAlign: 'center', borderRadius: 10, bgcolor: '#1976d2', color: 'white' }}>
            <Typography align="center" fontWeight="bold">
              {sourceAirport?.city} to {destinationAirport?.city}
            </Typography>
          </Paper>

          <Typography variant="h5" fontWeight={600} mb={4}>
            Passengers
          </Typography>

          {passengers?.map((p, i) => {
            const valid = isPassengerValid(p);
            return (
              <Card key={i} sx={{ mb: 2 }}>
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    onClick={() => toggleCard(i)}
                    sx={{ cursor: "pointer", backgroundColor: "#f7fbff", p: 2 }}
                  >
                    {/* Vertical Progress */}
                    <Box sx={{ width: 4, height: 48, bgcolor: valid ? "success.main" : "error.main", borderRadius: 1, mr: 2 }} />
                    <Box flexGrow={1}>
                      <Typography fontWeight="bold">
                        {p.type === "adult" ? `Adult ${i + 1}` : `Infant ${i - adults + 1}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {valid ? "Completed" : "Incomplete"}
                      </Typography>
                    </Box>
                    <IconButton>{selectedPassenger === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                  </Box>

                  {selectedPassenger === i && (
                    <>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ p: 2, pt: 0 }}>
                        <RadioGroup row value={p.gender} onChange={(e) => updatePassenger(i, "gender", e.target.value)}>
                          <FormControlLabel value="Male" control={<Radio />} label="Male" />
                          <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        </RadioGroup>

                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="First Name"
                              fullWidth
                              required
                              value={p.firstName}
                              onChange={(e) => updatePassenger(i, "firstName", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Last Name"
                              fullWidth
                              required
                              value={p.lastName}
                              onChange={(e) => updatePassenger(i, "lastName", e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              type="date"
                              label={`Date of Birth ${p.type === "infant" ? "(Mandatory)" : "(Optional)"}`}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              required={p.type === "infant"}
                              value={p.dob}
                              onChange={(e) => updatePassenger(i, "dob", e.target.value)}
                              error={Boolean(p.type === "infant" && p?.dob && ((new Date(departDate) - new Date(p?.dob)) / (1000 * 60 * 60 * 24 * 365) > 2))}
                              helperText={
                                p?.type === "infant" && p?.dob && ((new Date(departDate) - new Date(p?.dob)) / (1000 * 60 * 60 * 24 * 365) > 2) ?
                                  "Infant must be under 2 years" : ""}
                            />
                          </Grid>
                          {p?.type === "infant" &&
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel id="taggedTo-label">Infant Tagged To</InputLabel>
                                <Select
                                  labelId="taggedTo-label"
                                  label="Tagged To"
                                  name="taggedTo"
                                  required
                                  value={`${p?.taggedTo || ""}`}
                                  onChange={(e) => updatePassenger(i, "taggedTo", e.target.value)}
                                  sx={{ width: "100%" }}
                                >
                                  {passengers?.filter(p => p.type === "adult")?.map((adult, idx) => (
                                    <MenuItem key={adult?.id} value={`${adult?.id}`} disabled={adult?.infantTagged && p?.id !== adult?.infantTagged?.id}>
                                      Adult {idx + 1} – {adult?.firstName || "Unnamed"}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>}
                        </Grid>
                      </Box>
                    </>
                  )}
                </Box>
              </Card>
            );
          })}
          <Grid sx={{ mt: 6 }}>
            <Typography variant="h6" mb={2}>
              Contact Details
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Booking Confirmation will be sent to this contact
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={contact?.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  error={Boolean(contact?.email?.length && !isEmailValid(contact?.email))}
                  helperText={
                    contact?.email && !isEmailValid(contact?.email)
                      ? "Invalid email"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Number"
                  type="tel"
                  fullWidth
                  required
                  value={contact.mobile}
                  onChange={(e) => handleContactChange("mobile", e.target.value)}
                  error={Boolean(contact?.mobile && !isMobileValid(contact?.mobile))}
                  helperText={
                    contact?.mobile && !isMobileValid(contact?.mobile)
                      ? "Enter 10-digit mobile number"
                      : ""
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <TripSummary
            priceBreakdown={{
              basePrice: selectedFlight?.fare?.basePrice * adults || 0,
              taxes: (selectedFlight?.fare?.totalPrice - selectedFlight?.fare?.basePrice) * adults,
              totalPrice: selectedFlight?.fare?.totalPrice * adults || 0,
            }}
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!isFormValid}
            onClick={handleNext}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PassengerDetailsPage;