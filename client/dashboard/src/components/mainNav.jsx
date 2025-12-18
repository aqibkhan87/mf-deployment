import React, { useState, useEffect } from "react";
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
  Badge
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useCartStore } from "store/cartStore";
import { useAuthStore } from "store/authStore";
import { useWishlistStore } from "store/wishlistStore";
import { getCart } from "../apis/cart";
import { getWishlistProducts } from "../apis/wishlist.js";

const MainNav = () => {
  const history = useHistory();
  const { cartId, cartCount, setCartId } = useCartStore();
  const { wishlistCount } = useWishlistStore();
  const { user, setUser } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (cartId) getCart();
    if (user?.email) getWishlistProducts();
  }, []);

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddress = () => {
    handleCloseMenu();
    history.push("/addresses");
  };

  const handleOrder = () => {
    handleCloseMenu();
    history.push("/order-history");
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
          <Link to="/cart/view" className="p-2">
            <IconButton>
              <Badge
                badgeContent={cartCount}
                color="error"
                max={1000}
                sx={{
                  "& .MuiBadge-badge": {
                    transform: "translate(15px, -15px)",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Link>
          {user?.email ?
            <Link to="/wishlist" className="p-2">
              <IconButton>
                <Badge
                  badgeContent={wishlistCount}
                  color="error"
                  max={1000}
                  sx={{
                    "& .MuiBadge-badge": {
                      transform: "translate(15px, -15px)",
                    },
                  }}
                >
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Link> : null}
          {!user?.email ? (
            <Button className="p-2" >
              <Link to="/auth/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </Button>
          ) : (
            <>
              <IconButton onClick={handleOpenMenu} sx={{ p: 0, mx: 2 }}>
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
                <MenuItem onClick={handleOrder}>Orders</MenuItem>
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
