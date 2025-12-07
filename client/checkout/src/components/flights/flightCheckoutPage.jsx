import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, Chip } from "@mui/material";
import { useAuthStore } from "store/authStore";
import { useBookingStore } from "store/bookingStore";
import OrderSummary from "../../common/ecommerce/orderSummary.jsx";
import CheckoutItems from "../../common/ecommerce/checkout.jsx";
import { eventEmitter } from "../../utils/helper.js";

const Checkout = () => {
  const { user, address } = useAuthStore();
  const { selectedFlight, setBookingId } = useBookingStore();
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  const [step, setStep] = useState("auth"); // 1-auth, 2-address

  useEffect(() => {
    if (step == "auth" && isEditMode && user?.email && !address) {
      setStep("address");
    }

    if (isEditMode && user?.email && address?.length) {
      setIsContinueDisabled(false);
      setIsEditMode(false);
    }
  }, [isEditMode, user, address]);

  const handleUserInfo = () => {
    const eventData = { openPopup: true, popupType: "login" };
    eventEmitter("openLoginPopup", eventData);
    setIsEditMode(true);
  };

  const selectAddress = () => {
    const eventData = { openAddressForm: true };
    eventEmitter("openAddressForm", eventData);
    setStep("address");
  };

  const editAddress = () => {
    const eventData = { openAddressForm: true, address: address };
    eventEmitter("openAddressForm", eventData);
    setIsEditMode(true);
  };

  const LoginUserDetails = () => {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: step === "auth" ? "#F5F7F8" : "#fafafa",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Chip
              label="1"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>
              {user?.name}-{user?.mobile}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const UserNotLoggedIn = () => {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Chip
              label="1"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>LOGIN</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => handleUserInfo(true)}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const AddressNotSelected = () => {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: step === "address" ? "#F5F7F8" : "#fafafa",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <Chip
              label="2"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>DELIVERY ADDRESS</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => selectAddress(true)}
            >
              Select Address
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const DisplayAddress = () => {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Chip
              label="2"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>{address}</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => editAddress()}
            >
              Edit Address
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {user?.email ? <LoginUserDetails /> : <UserNotLoggedIn />}
          {address ? <DisplayAddress /> : <AddressNotSelected />}
          <CheckoutItems />

          {user?.email && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}>
              <Typography>
                Order confirmation email will be sent to <b>{user?.email}</b>
              </Typography>
            </Paper>
          )}
          <Button
            variant="contained"
            color="warning"
            sx={{ float: "right", fontSize: 16, px: 6, mb: 4 }}
            disabled={isContinueDisabled}
            onClick={handlePayment}
          >
            Continue to Payment
          </Button>
        </Grid>
        <OrderSummary />
      </Grid>
    </Box>
  );
};

export default Checkout;
