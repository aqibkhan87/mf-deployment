import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { ProductContext } from "store/productContext";

const MainNav = () => {
  const { cart, wishlist } = useContext(ProductContext);
  console.log("cart, wishlist ", cart, wishlist )

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <AppBar position="static" sx={{ bgcolor: "#2874f0" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Flipkart Clone</Typography>
          <Box>
            <Button color="inherit"><Link to="/auth/login">Login</Link></Button>
            <Button color="inherit"><Link to="/checkout/cart">Cart</Link></Button>
          </Box>
        </Toolbar>
      </AppBar>
      </div>
    </header>
  );
};

export default MainNav;
