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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { createBooking } from "../../apis/flights/booking";
import { searchFlights } from "../../apis/flights/searchflight";
import { useBookingStore } from "store/bookingStore";
import { isEmailValid, isMobileValid, formatDate, formatTime } from "../../utils/helper";


const createPassenger = (type, open = false) => ({
  type, // "adult" or "infant"
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  taggedTo: null,
  open,
});

const isPassengerValid = (p) => {
  if (!p.firstName || !p.lastName || !p.gender) return false;
  if (p.type === "infant") {
    if (!p.dob) return false;
    const dobDate = new Date(p.dob);
    const depDate = new Date();
    const ageInYears = (depDate - dobDate) / (1000 * 60 * 60 * 24 * 365);
    if (ageInYears > 2) return false; // Infant cannot be older than 2
  }
  return true;
};

function PassengerDetailsPage() {
  const history = useHistory();
  const { selectedFlight } = useBookingStore();

  const searchInfo = JSON.parse(sessionStorage.getItem("selectedFlight") || "{}");
  const { from, to, departDate, passengers: paxObj, providerId, flightId } = searchInfo;
  const adults = paxObj?.adult || 0;
  const infants = paxObj?.infant || 0;

  const [loading, setLoading] = useState(false);

  const [passengers, setPassengers] = useState(() => [
    ...Array.from({ length: adults }, (_, i) => createPassenger("adult", i === 0)),
    ...Array.from({ length: infants }, (_, i) => createPassenger("infant")),
  ]);
  const [contact, setContact] = useState({ email: "", mobile: "" });

  const segment = selectedFlight?.fare?.segments?.[0];


  useEffect(() => {
    fetchFlight();
  }, []);

  const fetchFlight = async () => {
    setLoading(true);
    await searchFlights({ from, to, date: departDate, providerId, flightId });
    setLoading(false);
  };

  const toggleCard = (idx) => {
    setPassengers((prev) =>
      prev.map((p, i) => ({ ...p, open: i === idx ? !p.open : p.open }))
    );
  };

  const updatePassenger = (idx, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const isFormValid = useMemo(() => passengers.every(isPassengerValid), [passengers]);

  const handleNext = async () => {
    const payload = { flightId, providerId, from, to, departDate, passengers, contact };
    const res = await createBooking(payload);
    localStorage.setItem("bookingId", res.bookingId);
    history.push("/addons");
  };

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  if (loading || !selectedFlight) return <Container sx={{ py: 6 }}>Loading…</Container>;

  return (
    <Container  sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid item xs={12} md={8}>
          <Card sx={{ my: 2 }}>
            <CardContent>
              <Typography align="center" fontWeight="bold">
                {segment?.departureAirport} → {segment?.arrivalAirport}
              </Typography>
              <Typography align="center" color="text.secondary">
                {formatDate(departDate)}
              </Typography>
            </CardContent>
          </Card>

          {passengers.map((p, i) => {
            const valid = isPassengerValid(p);
            return (
              <Card key={i} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" onClick={() => toggleCard(i)} sx={{ cursor: "pointer" }}>
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
                    <IconButton>{p.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                  </Box>

                  {p.open && (
                    <>
                      <Divider sx={{ my: 2 }} />
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
                            label="Date of Birth"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required={p.type === "infant"}
                            value={p.dob}
                            onChange={(e) => updatePassenger(i, "dob", e.target.value)}
                            error={p.type === "infant" && p.dob && ((new Date(departDate) - new Date(p.dob)) / (1000 * 60 * 60 * 24 * 365) > 2)}
                            helperText={p.type === "infant" && p.dob && ((new Date(departDate) - new Date(p.dob)) / (1000 * 60 * 60 * 24 * 365) > 2) ? "Infant must be under 2 years" : ""}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Contact Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    error={contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)}
                    helperText={
                      contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
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
                    error={contact.mobile && !/^[0-9]{10}$/.test(contact.mobile)}
                    helperText={
                      contact.mobile && !/^[0-9]{10}$/.test(contact.mobile)
                        ? "Enter 10-digit mobile number"
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Trip Summary</Typography>
              <Typography color="text.secondary" mt={1}>
                {adults} Adult{adults > 1 ? "s" : ""}{infants > 0 && `, ${infants} Infant`}
              </Typography>

              <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <Typography fontWeight="bold">{segment?.departureAirport} → {segment?.arrivalAirport}</Typography>
                <Typography variant="caption">{formatTime(segment?.departureTime)} — {formatTime(segment?.arrivalTime)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography>Adults × {adults}</Typography>
                <Typography>₹ {selectedFlight?.fare?.totalPrice * adults}</Typography>
              </Box>

              {infants > 0 && (
                <Box display="flex" justifyContent="space-between">
                  <Typography>Infants × {infants}</Typography>
                  <Typography color="success.main">Free</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography align="right" variant="h6">Total: ₹ {selectedFlight?.fare?.totalPrice * adults}</Typography>
            </CardContent>
          </Card>

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