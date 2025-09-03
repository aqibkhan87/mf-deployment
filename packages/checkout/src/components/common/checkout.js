import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  IconButton,
  Chip,
  Card,
  CardMedia,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useCartStore } from "store/cartStore";
import { addQuantity, subtractQuantity } from "../../utils/helper";

const CheckoutItems = () => {
  const { cart, updateQuantityInCart } = useCartStore();

  const navigateToProduct = (product) => {
    history.push(`/product/${product?.categoryid}/${product?.id}`);
  };

  const addItemQuantity = (categoryid, productid) => {
    const updatedCart = addQuantity(categoryid, productid, cart);
    updateQuantityInCart(updatedCart);
  };

  const subtractItemQuantity = (categoryid, productid) => {
    const updatedCart = subtractQuantity(categoryid, productid, cart);
    updateQuantityInCart(updatedCart);
  };

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
      {/* ITEMS SUMMARY */}
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Chip
            label="3"
            sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
          />
        </Grid>
        <Grid item xs>
          <Typography sx={{ fontWeight: 600 }}>CHECKOUT ITEMS</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />

      {cart?.map((product, ind) => (
        <Grid
          container
          spacing={2}
          key={ind}
          onClick={() => navigateToProduct(product)}
        >
          <Grid item xs={2.2}>
            <CardMedia
              component="img"
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                m: 1,
                borderRadius: 2,
              }}
              image={product?.productImage}
              alt={product?.name}
            />
          </Grid>
          <Grid item xs={9.8}>
            <Typography sx={{ fontWeight: 600 }}>{product?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {product?.size}, {product?.color}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seller: {product?.seller}
            </Typography>

            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ₹{product?.price}
              </Typography>
              <Typography variant="body2" color="green">
                {product.offers} offers available
              </Typography>
              <InfoOutlinedIcon fontSize="small" color="action" />
            </Box>

            {/* Delivery message */}
            <Box sx={{ my: 1.5, display: "flex", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">
                Delivery by <b>Thu Sep 4</b>
              </Typography>
              <Box
                sx={{
                  background: "#fffde7",
                  color: "#fbc02d",
                  py: 0.5,
                  px: 1.1,
                  borderRadius: 1,
                  ml: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <b>Open Box Delivery is eligible for this item.</b>&nbsp;
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 400 }}
                >
                  You will receive a confirmation post payment.
                  <a
                    href="#"
                    style={{
                      marginLeft: 4,
                      fontWeight: 600,
                      textDecoration: "none",
                      color: "#2672f2",
                    }}
                  >
                    Know More
                  </a>
                </Typography>
              </Box>
            </Box>

            {/* Quantity controls & Remove */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  subtractItemQuantity(product?.categoryid, product?.id);
                }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography
                variant="body1"
                sx={{ minWidth: 32, textAlign: "center" }}
              >
                {product?.quantity}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addItemQuantity(product?.categoryid, product?.id);
                }}
              >
                <AddIcon />
              </IconButton>
              <Button color="error" size="small" sx={{ ml: 2 }}>
                REMOVE
              </Button>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Paper>
  );
};

export default CheckoutItems;
