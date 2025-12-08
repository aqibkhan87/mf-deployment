import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Badge from "@mui/material/Badge";
import { useCartStore } from "store/cartStore";
import { useAuthStore } from "store/authStore";

const MainNav = () => {
  const { cartCount, wishlistCount, setCartId } = useCartStore();
  const { user, setUser } = useAuthStore();

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({}));
    localStorage.setItem("cartId", "");
    localStorage.setItem("token", "");
    localStorage.setItem("address", "");
    setUser({});
    setCartId("");
  };

  return (
    <AppBar
      className="shadow-md top-0 z-20"
      sx={{
        backgroundColor: "white",
        position: "sticky",
      }}
    >
      <Toolbar className="flex items-center justify-between">
        <Box>
          <Link
            to={"/"}
            style={{ textDecoration: "none" }}
            className="text-black"
          >
            <Typography variant="h6">Metacook</Typography>
          </Link>
        </Box>
        <Box>
          {!user?.email ? (
            <Button className="text-black">
              <Link to="/auth/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </Button>
          ) : (
            <Button className="text-black" onClick={(e) => handleLogOut(e)}>
              <Link to="/auth/login" style={{ textDecoration: "none" }}>
                Logout
              </Link>
            </Button>
          )}
          <Button className="text-black">
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
          <Button className="text-black">
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
  );
};

export default MainNav;
