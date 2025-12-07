import React from "react";
import { Paper, Typography, Grid, Divider } from "@mui/material";
import { useCartStore } from "store/cartStore";

const OrderSummary = () => {
  const { cart } = useCartStore();

  // console.log("cart in order Summary", cart)
  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          ORDER SUMMARY
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {cart?.products?.map((product, i) => (
          <Grid container spacing={1} key={i}>
            <Grid item xs={8}>
              <Typography>{product?.productDetail?.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography align="right">₹{product?.productDetail?.price} x {product?.quantity}</Typography>
            </Grid>
          </Grid>
        ))}
        <Divider sx={{ my: 1 }} />
        <Grid container>
          <Grid item xs={8}>
            <Typography>
              <b>Total Payable</b>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align="right" sx={{ fontWeight: 600 }}>
              ₹{cart?.totalAmount}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={8}>
            <Typography>
              Actual Payable
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align="right" sx={{ fontWeight: 500 }}>
              ₹{cart?.totalActual}
            </Typography>
          </Grid>
        </Grid>
        <Typography sx={{ color: "green", mt: 1 }}>
          Your Total Savings on this order ₹{cart?.savedAmount}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default OrderSummary;
