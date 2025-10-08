import React from "react";
import { Box, Grid } from "@mui/material";
import OrderSummary from "./common/orderSummary";
import Cart from "./common/cart";
import { useCartStore } from "store/cartStore";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="p-4">
      {cart?.products?.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <Box sx={{ p: 3, background: "#f7fbff", minHeight: "100vh" }}>
          <Grid container spacing={2} justifyContent="center">
            <Cart />
            <OrderSummary />
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default CartPage;
