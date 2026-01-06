import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, Chip } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import { useCartStore } from "store/cartStore";
import OrderSummary from "../../common/ecommerce/orderSummary";
import CheckoutItems from "../../common/ecommerce/checkout";
import { eventEmitter } from "../../utils/helper";
import { loadRazorpay } from "../../utils/loadRazorpay";
import { createOrder, verifyPayment } from "../../apis/payment";
import { getAllAddresses } from "../../apis/address";

const Checkout = () => {
  const history = useHistory();
  const { user, address, addresses, setAddress } = useAuthStore();
  const { setCartCount } = useCartStore();
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

  useEffect(() => {
    if(!localStorage.getItem("cartId")) {
      history.push("/")
    }
  }, []);
  
  useEffect(() => {
    setDefaultAddress();
  }, [addresses]);

  useEffect(() => {
    if (user?.email) getAllAddresses();
    return () => {
      setAddress({})
    }
  }, []);

  const setDefaultAddress = () => {
    if (addresses?.length) {
      const defaultAddr = addresses?.find((addr) => addr?.isDefault) || addresses[0];
      if(defaultAddr) setAddress(defaultAddr)
    };
  }

  const handleUserInfo = () => {
    const eventData = { openPopup: true, popupType: "login" };
    eventEmitter("openLoginPopup", eventData);
    setIsEditMode(true);
  };

  const AddAddress = () => {
    const eventData = { openAddressForm: true };
    eventEmitter("openAddressForm", eventData);
    setStep("address");
  };

  const editAddress = (editAdd) => {
    const eventData = { openAddressForm: true, address: editAdd };
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
              {user?.firstName} {user?.lastName}
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
              onClick={(e) => AddAddress(true)}
            >
              Add Address
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
              onClick={(e) => editAddress(addresses?.[0])}
            >
              Edit Address
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const handleCheckout = async () => {
    // 1️⃣ Create Order
    const data = await createOrder({
      type: "ECOMMERCE", // or FLIGHT
      entityId: JSON.parse(localStorage.getItem("cartId")) || "",
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
            type: "ECOMMERCE",
            entityId: JSON.parse(localStorage.getItem("cartId")) || "",
            ...res,
          });

          if (verify.success) {
            localStorage.removeItem("cartId");
            setCartCount(0)
            history.push("/");
          }
        } catch(err) {
          console.log("Payment verification failed", err);
        }
      },

      modal: {
        ondismiss: async (err) => {
          console.log("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async () => {
      alert("Payment failed");
    });

    rzp.open();
  };



  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 3, px: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Checkout
          </Typography>
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
            color="primary"
            sx={{ float: "right", fontSize: 16, px: 6, mb: 4 }}
            disabled={isContinueDisabled}
            onClick={handleCheckout}
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
