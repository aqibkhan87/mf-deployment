import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Badge from "@mui/material/Badge";
import { useCartStore } from "store/cartStore";
import { useAuthStore } from "store/authStore";

const MainNav = () => {
  const { cartCount, wishlistCount } = useCartStore();
  const { user, setUser } = useAuthStore();

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({}));
    setUser({});
  };

  return (
    <AppBar
      className="shadow-md top-0 z-20"
      sx={{
        backgroundColor: "white",
        position: "sticky"
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography variant="h6">Metacook</Typography>
          </Link>
          <Box>
            {!user?.email ? (
              <Button color="inherit">
                <Link to="/auth/login" style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </Button>
            ) : (
              <Button color="inherit" onClick={(e) => handleLogOut(e)}>
                <Link to="/auth/login" style={{ textDecoration: "none" }}>
                  Logout
                </Link>
              </Button>
            )}
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
      </div>
    </AppBar>
  );
};

export default MainNav;
