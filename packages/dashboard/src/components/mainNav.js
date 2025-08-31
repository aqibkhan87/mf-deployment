import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { ProductContext } from "store/productContext";
import Badge from "@mui/material/Badge";
import { useCartStore } from "store/cartStore";

const MainNav = () => {
  const { wishlist } = useContext(ProductContext);
  const { cart, cartCount } = useCartStore();
  const wishlistCount = wishlist?.reduce(
    (count, item) => item?.quantity + count,
    0
  );
  console.log(cartCount, "cartCount", cart)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <AppBar position="static" sx={{ bgcolor: "#2874f0" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">Flipkart Clone</Typography>
            <Box>
              <Button color="inherit">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button color="inherit">
                <Link to="/cart/view">
                  <Badge
                    badgeContent={cartCount}
                    color="error"
                    max={1000}
                    sx={{
                      // Use transform to shift badge position
                      "& .MuiBadge-badge": {
                        transform: "translate(15px, -15px)",
                      },
                    }}
                  >
                    Cart
                  </Badge>
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/product/wishlist">
                  <Badge
                    badgeContent={wishlistCount}
                    color="error"
                    max={1000}
                    sx={{
                      // Use transform to shift badge position
                      "& .MuiBadge-badge": {
                        transform: "translate(15px, -15px)",
                      },
                    }}
                  >
                    Wishlist
                  </Badge>
                </Link>
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </div>
    </header>
  );
};

export default MainNav;
