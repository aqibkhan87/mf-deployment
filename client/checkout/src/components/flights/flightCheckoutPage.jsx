import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, Chip } from "@mui/material";
import { useAuthStore } from "store/authStore";
import { useBookingStore } from "store/bookingStore";
import OrderSummary from "../../common/ecommerce/orderSummary";
import CheckoutItems from "../../common/ecommerce/checkout";
import { eventEmitter } from "../../utils/helper.js";

const Checkout = () => {
  const { user, address } = useAuthStore();
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  const [step, setStep] = useState("auth"); // 1-auth

  useEffect(() => {
    if (step == "auth" && isEditMode && user?.email && !address) {
      setStep("address");
    }

    if (isEditMode && user?.email) {
      setIsContinueDisabled(false);
      setIsEditMode(false);
    }
  }, [isEditMode, user, address]);

  const handleUserInfo = () => {
    const eventData = { openPopup: true, popupType: "login" };
    eventEmitter("openLoginPopup", eventData);
    setIsEditMode(true);
  };

  const handlePayment = async () => {
    // 1️⃣ Create Order
    const data = await createOrder({
      type: "FLIGHT", // or ECOMMERCE
      entityId: JSON.parse(localStorage.getItem("bookingId")) || "",
    });
    console.log("order data", data);

    // ✅ ZERO AMOUNT
    if (data?.skipPayment) {
      history.push("/dashboard");
      return;
    }

    // 2️⃣ Load Razorpay
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Payment SDK failed. Try again.");
      return;
    }
    // 3️⃣ Payment Options
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      order_id: data.orderId,
      amount: data.amount,
      currency: "INR",

      handler: async (res) => {
        try {
          const verify = await verifyPayment({
            type: "FLIGHT",
            entityId,
            ...res,
          });

          if (verify.success) {
            navigate("/dashbaord");
          }
        } catch (err) {
          console.log("errrrrrr", err);
          alert("Payment verification failed");
        }
      },

      modal: {
        ondismiss: async () => {
          alert("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async (err) => {
      alert("Payment failed");
    });

    rzp.open();
  }

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




  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {user?.email ? <LoginUserDetails /> : <UserNotLoggedIn />}
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
