import React, { useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
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

  const navigateToCheckout = () => {
    history.push("/ecommerce/checkout");
  }

  return (
    <div className="">
      {!cart?.products?.length ? (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">No items in cart</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Cart />
            </Grid>
            <Grid item xs={12} md={4}>
              <OrderSummary />
              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                color="primary"
                sx={{ my: 2, fontSize: 18, textTransform: "none" }}
                onClick={navigateToCheckout}
                aria-label="Proceed To Checkout"
              >
                Proceed to checkout
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default CartPage;
