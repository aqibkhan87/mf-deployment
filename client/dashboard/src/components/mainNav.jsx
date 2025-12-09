import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Divider,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { useCartStore } from "store/cartStore";
import { useAuthStore } from "store/authStore";
import { useWishlistStore } from "store/wishlistStore";

const MainNav = () => {
  const history = useHistory();
  const { cartCount, setCartId } = useCartStore();
  const { wishlistCount } = useWishlistStore();
  const { user, setUser } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleAddress = () => {
    handleCloseMenu();
    history.push("addresses");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({}));
    localStorage.setItem("cartId", "");
    localStorage.setItem("token", "");
    localStorage.setItem("address", "");
    setUser({});
    setCartId("");
    handleCloseMenu();
    history.push("/auth/login");
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
            <Link to="/wishlist">
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
            {!user?.email ? (
              <Button className="text-black">
                <Link to="/auth/login" style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </Button>
            ) : (
              <>
                <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.firstName} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1">{user?.firstName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>

                  <Divider />

                  <MenuItem onClick={handleCloseMenu}>User Profile</MenuItem>
                  <MenuItem onClick={handleAddress}>Addresses</MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
              </>
            )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainNav;
