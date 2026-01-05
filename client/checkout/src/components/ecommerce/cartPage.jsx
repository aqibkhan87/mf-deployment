import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useCartStore } from "store/cartStore";
import OrderSummary from "../../common/ecommerce/orderSummary";
import Cart from "../../common/ecommerce/cart";

const CartPage = () => {
  const { cart } = useCartStore();
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("cartId")) {
      history.push("/")
    }
  }, []);

  return (
    <div className="">
      {!cart?.products?.length ? (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">No items in cart</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
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
