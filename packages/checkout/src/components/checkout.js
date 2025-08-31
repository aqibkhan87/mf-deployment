import React, { useContext, useState } from "react";
import { ProductContext } from "store/productContext";
import Cart from "./common/cart";
import Addons from "../components/addons";
import Recommendations from "../components/recommendations";

import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  IconButton,
  Chip,
  Card,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ShieldIcon from "@mui/icons-material/Security";
import OrderSummary from "./common/orderSummary";
import AddressForm from "./common/address";
import { useCartStore } from "store/cartStore";
import CheckoutItems from "./common/checkout";

const Checkout = () => {
  const { cart } = useCartStore();
  const [addons, setAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);


  const handleAddonSelect = (addon, checked) => {
    setAddons((prev) => checked ? [...prev, addon] : prev.filter((a) => a.id !== addon.id));
  };

  const product = {
    name: "NIKE Downshifter 13 Running Shoes For Men",
    size: 6,
    color: "Grey",
    seller: "NikeIndiaPvtLtd",
    assured: true,
    price: 4295,
    platformFee: 0,
    offers: 8,
    altPrice: 4195,
    points: 100,
    image:
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2e7a4412-ab08-42d5-89d4-3b4ca6e79206/downshifter-13-mens-road-running-shoes-lLpztr.png", // Sample image
  };

  const email = "aqibkhan8791@outlook.com";
  const address = "Abc sds dsd s, sas, Gurugram, Haryana - 122001";
  const user = { name: "Aqib Khan", phone: "+918791232678" };

  const totalPrice = product.price * quantity + product.platformFee;
  const total = cart?.reduce((acc, item) => acc + item.price, 0) + addons?.reduce((acc, a) => acc + a.price, 0);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Grid container spacing={2}>
        {/* Left Side Summary */}
        <Grid item xs={12} md={8}>
          {/* <Cart /> */}
          {/* LOGIN SUMMARY */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Chip
                  icon={<CheckCircleIcon color="primary" />}
                  label="1"
                  sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                <Typography sx={{ fontWeight: 600 }}>LOGIN</Typography>
                <Typography>
                  {user.name} &nbsp;{user.phone}
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="outlined" size="small">CHANGE</Button>
              </Grid>
            </Grid>
          </Paper>

          <AddressForm />

          {/* ITEMS SUMMARY */}
          <CheckoutItems />

          {/* Confirmation and continue */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}>
            <Typography>
              Order confirmation email will be sent to <b>{email}</b>
            </Typography>
          </Paper>
          <Button
            variant="contained"
            color="warning"
            sx={{ float: "right", fontSize: 16, px: 6, mb: 4 }}
          >
            CONTINUE
          </Button>
        </Grid>
        <OrderSummary />
      </Grid>
    </Box>
  );
}

export default Checkout;
