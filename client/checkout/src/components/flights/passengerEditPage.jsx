import React, { useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function PassengerDetailsPage() {
  const history = useHistory();

  const selectedFlight = {
    segments: [
      {
        from: "BOM",
        to: "DXB",
        departureTime: "2025-02-15T04:15",
        arrivalTime: "2025-02-15T06:05",
      },
    ],
    fare: {
      price: 17800,
      currency: "INR",
    },
  };

  const segment = selectedFlight.segments[0];

  const [adults] = useState(2);
  const [infants] = useState(1);

  const [passengers, setPassengers] = useState([
    { type: "adult", title: "Male", first: "", last: "", dob: "", age: "", open: true },
    { type: "adult", title: "Female", first: "", last: "", dob: "", age: "", open: false },
    { type: "infant", title: "Male", first: "", last: "", dob: "", age: "", taggedTo: 0, open: true },
  ]);

  const toggleCard = (index) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, open: !p.open } : p))
    );
  };

  const handleChange = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  return (
    <Box maxWidth="xl" mx="auto" p={2}>
      <Grid container spacing={3}>
        {/* LEFT SECTION */}
        <Grid item xs={12} md={8}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button onClick={() => history.goBack()}>← Back</Button>
            <Typography variant="body2">Next: Add Ons</Typography>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center">
                {segment.from} — {segment.to}
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Enter Passenger Details
          </Typography>

          {passengers.map((p, i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  onClick={() => toggleCard(i)}
                  sx={{ cursor: "pointer" }}
                >
                  <Box>
                    <Typography fontWeight="bold">
                      {p.type === "adult"
                        ? `Adult ${i + 1}`
                        : `Infant ${i - adults + 1}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.type === "infant"
                        ? `Tagged to Adult ${p.taggedTo + 1}`
                        : "Passenger"}
                    </Typography>
                  </Box>
                  <IconButton>
                    {p.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                {p.open && (
                  <>
                    <Divider sx={{ my: 2 }} />

                    <RadioGroup
                      row
                      value={p.title}
                      onChange={(e) =>
                        handleChange(i, "title", e.target.value)
                      }
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>

                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          fullWidth
                          value={p.first}
                          onChange={(e) =>
                            handleChange(i, "first", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          fullWidth
                          value={p.last}
                          onChange={(e) =>
                            handleChange(i, "last", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          type="date"
                          label="Date of Birth"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={p.dob}
                          onChange={(e) =>
                            handleChange(i, "dob", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Age"
                          type="number"
                          fullWidth
                          value={p.age}
                          onChange={(e) =>
                            handleChange(i, "age", e.target.value)
                          }
                        />
                      </Grid>
                    </Grid>

                    {p.type === "infant" && (
                      <Box mt={2}>
                        <Typography fontWeight="bold" mb={1}>
                          Tagged To Adult
                        </Typography>
                        <RadioGroup
                          value={p.taggedTo}
                          onChange={(e) =>
                            handleChange(i, "taggedTo", Number(e.target.value))
                          }
                        >
                          {passengers
                            .filter((a) => a.type === "adult")
                            .map((_, idx) => (
                              <FormControlLabel
                                key={idx}
                                value={idx}
                                control={<Radio />}
                                label={`Adult ${idx + 1}`}
                              />
                            ))}
                        </RadioGroup>
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          {infants > 0 && (
            <Typography color="success.main" align="center" fontWeight="bold">
              🎉 Infant discount applied — ₹1750 off!
            </Typography>
          )}
        </Grid>

        {/* RIGHT SECTION */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Trip Summary</Typography>

              <Typography variant="body2" color="text.secondary" mt={1}>
                {adults} Adult, {infants} Infant
              </Typography>

              <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <Typography fontWeight="bold">
                  {segment.from} → {segment.to}
                </Typography>
                <Typography variant="caption">
                  {segment.departureTime} — {segment.arrivalTime}
                </Typography>
              </Box>

              <Typography variant="h6" align="right" mt={2}>
                ₹ {selectedFlight.fare.price}
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => history.push("/addons")}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PassengerDetailsPage;