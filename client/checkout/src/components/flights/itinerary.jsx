import React from "react";
import {
Box,
Paper,
Typography,
Divider,
Grid,
Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightIcon from "@mui/icons-material/Flight";

const booking = {
  bannerImage: "/images/flight-banner.jpg",
  pnr: "AB3X9Q",
  email: "user@email.com",

  segments: [
    {
      airline: "IndiGo",
      flightNumber: "6E-203",
      from: { city: "Delhi", iata: "DEL" },
      to: { city: "Mumbai", iata: "BOM" },
      departureTime: "08:00",
      arrivalTime: "10:05",
      date: "25 Dec 2025",
      duration: "2h 05m",
      baggage: {
        cabin: "7 Kg",
        checkin: "15 Kg",
      },
    },
    {
      airline: "IndiGo",
      flightNumber: "6E-412",
      from: { city: "Mumbai", iata: "BOM" },
      to: { city: "Bengaluru", iata: "BLR" },
      departureTime: "11:30",
      arrivalTime: "13:00",
      date: "25 Dec 2025",
      duration: "1h 30m",
      baggage: {
        cabin: "7 Kg",
        checkin: "15 Kg",
      },
    },
  ],

  passengers: [
    {
      title: "Mr",
      name: "Rahul Sharma",
      seat: "12A",
      meal: "Veg",
    },
  ],

  payment: {
    mode: "Razorpay",
    txnId: "TXN982734",
    total: 8450,
  },

  contact: {
    name: "Rahul Sharma",
    email: "rahul@email.com",
    phone: "+91 9876543210",
  },
};

const ItineraryPage = ({  }) => {
    const firstSegment = booking.segments[0];
    const lastSegment = booking.segments[booking.segments.length - 1];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 3 }}>
      {/* ===================== CONFIRMATION BANNER ===================== */}
      <Paper
        sx={{
          position: "relative",
          height: 260,
          backgroundImage: `url(${booking.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Avatar sx={{ bgcolor: "#2e7d32", mb: 1 }}>
            <CheckCircleIcon />
          </Avatar>

          <Typography variant="h6" fontWeight={700}>
            Booking Confirmed
          </Typography>

          <Typography sx={{ mt: 1 }}>
            {firstSegment.from.iata} → {lastSegment.to.iata}
          </Typography>

          <Typography variant="body2">
            {firstSegment.date}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            PNR: <strong>{booking.pnr}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* ===================== CONFIRMATION MESSAGE ===================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          Your booking is confirmed. Confirmation has been sent to:
        </Typography>
        <Typography fontWeight={600}>{booking.email}</Typography>
      </Paper>

      {/* ===================== FLIGHT SEGMENTS ===================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Flight Details
        </Typography>

        {booking.segments.map((segment, index) => (
          <Box key={index}>
            {index > 0 && (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", my: 2, textAlign: "center" }}
              >
                Layover at {segment.from.city}
              </Typography>
            )}

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography fontWeight={600}>
                  {segment.airline} • {segment.flightNumber}
                </Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography variant="body2" color="text.secondary">
                  Departure
                </Typography>
                <Typography fontWeight={600}>
                  {segment.from.iata} – {segment.departureTime}
                </Typography>
                <Typography variant="body2">{segment.from.city}</Typography>
              </Grid>

              <Grid item xs={2} textAlign="center">
                <FlightIcon color="action" />
                <Typography variant="body2">{segment.duration}</Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography variant="body2" color="text.secondary">
                  Arrival
                </Typography>
                <Typography fontWeight={600}>
                  {segment.to.iata} – {segment.arrivalTime}
                </Typography>
                <Typography variant="body2">{segment.to.city}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Baggage Allowance
                </Typography>
                <Typography>
                  {segment.baggage.cabin} Cabin • {segment.baggage.checkin} Check-in
                </Typography>
              </Grid>
            </Grid>

            {index !== booking.segments.length - 1 && <Divider sx={{ my: 3 }} />}
          </Box>
        ))}
      </Paper>

      {/* ===================== PASSENGERS & ADDONS ===================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Passengers & Add-ons
        </Typography>

        {booking.passengers.map((p, i) => (
          <Box key={i} sx={{ mb: 1 }}>
            <Typography fontWeight={600}>
              {p.title} {p.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seat: {p.seat || "Not assigned"} | Meal: {p.meal || "Standard"}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* ===================== PAYMENT SUMMARY ===================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Payment Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Payment Mode
            </Typography>
            <Typography>{booking.payment.mode}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Transaction ID
            </Typography>
            <Typography>{booking.payment.txnId}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight={700}>
              Total Paid: ₹{booking.payment.total}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ===================== CONTACT DETAILS ===================== */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Contact Details
        </Typography>
        <Typography>{booking.contact.name}</Typography>
        <Typography>{booking.contact.email}</Typography>
        <Typography>{booking.contact.phone}</Typography>
      </Paper>
    </Box>
  );
};

export default ItineraryPage;
