import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import OrderSummary from "./common/orderSummary";
import AddressForm from "./common/addressForm";
import CheckoutItems from "./common/checkout";
import LoginSummary from "./common/loginSummary";
import { useAuthStore } from "store/authStore";

const Checkout = () => {
  const { user } = useAuthStore();
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  const [address, setAddress] = useState("");
  const [step, setStep] = useState("auth"); // 1-auth, 2-address, 3-items

  useEffect(() => {
    if (!isEditMode && user?.email && address) {
      setIsContinueDisabled(true);
    } else {
      setIsEditMode(true);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && user?.email && !address) {
      setStep("address");
    }
  }, [user]);

  const LoginUserDetails = () => {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: step === "address" ? "#F5F7F8" : "#fafafa",
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

  const AddressInfo = () => {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: step === "address" ? "#F5F7F8" : "#fafafa",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Chip
              label="2"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>DELIVERY ADDRESS</Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const CheckoutDefault = () => {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          bgcolor: step === "address" ? "#F5F7F8" : "#fafafa",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Chip
              label="3"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>CHECKOUT ITEMS</Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  console.log("isEditMode && step === ", isEditMode, step === "auth");
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Grid container spacing={2}>
        {/* Left Side Summary */}
        <Grid item xs={12} md={8}>
          {/* <Cart /> */}
          {/* LOGIN SUMMARY */}
          {isEditMode && step === "auth" ? <LoginSummary /> : <LoginUserDetails />}

          {isEditMode && user && step == "address" ? (
            <AddressForm isEditMode={isEditMode} />
          ) : (
            <AddressInfo />
          )}

          {/* ITEMS SUMMARY */}
          {!user?.name && !address ? <CheckoutItems /> : <CheckoutDefault />}

          {/* Confirmation and continue */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}>
            <Typography>
              Order confirmation email will be sent to <b>{user?.email}</b>
            </Typography>
          </Paper>
          <Button
            variant="contained"
            color="warning"
            sx={{ float: "right", fontSize: 16, px: 6, mb: 4 }}
            disabled={isContinueDisabled}
          >
            CONTINUE
          </Button>
        </Grid>
        <OrderSummary />
      </Grid>
    </Box>
  );
};

export default Checkout;
