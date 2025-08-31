import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useCartStore } from "store/cartStore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { addQuantity, subtractQuantity } from "../../utils/helper";

const Cart = () => {
  const history = useHistory();
  const { cart, updateQuantityInCart } = useCartStore();

  const navigateToProduct = (product) => {
    history.push(`/product/${product?.categoryid}/${product?.id}`);
  };

  const addItemQuantity = (categoryid, productid) => {
    const updatedCart = addQuantity(categoryid, productid, cart)
    updateQuantityInCart(updatedCart)
  };

  const subtractItemQuantity = (categoryid, productid) => {
    const updatedCart = subtractQuantity(categoryid, productid, cart)
    updateQuantityInCart(updatedCart)
  };

  return (
    <Grid item xs={12} md={7}>
      <Typography variant="h5" gutterBottom>
        Flipkart (1)
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>
            Deliver to: <b>Firozabad - 283203</b>
          </Typography>
          <Button variant="outlined" size="small">
            Change
          </Button>
        </Paper>
      </Box>
      {/* DELIVERY ADDRESS */}
      {history.location.pathname.includes("checkout") && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Chip
                icon={<CheckCircleIcon color="primary" />}
                label="2"
                sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
              />
            </Grid>
            <Grid item xs>
              <Typography sx={{ fontWeight: 600 }}>DELIVERY ADDRESS</Typography>
              <Typography>{address}</Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" size="small">
                CHANGE
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Card>
        {cart?.map((product, i) => (
          <Box
            key={i}
            sx={{ display: "flex", mb: 2 }}
            onClick={() => navigateToProduct(product)}
          >
            <CardMedia
              component="img"
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                m: 2,
                borderRadius: 2,
              }}
              image={product?.productImage}
              alt={product?.name}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" noWrap>
                  {product?.name}
                </Typography>
                <Typography color="text.secondary">{product?.color}</Typography>
                <Typography variant="body2">
                  Seller: {product?.seller}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#888",
                    }}
                  >
                    ₹{product?.oldPrice}
                  </span>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>
                    ₹{product?.price}
                  </span>
                  <span style={{ color: "green", marginLeft: 8 }}>
                    {product?.discountPercentage}
                  </span>
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    subtractItemQuantity(product?.categoryid, product?.id);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{product?.quantity}</Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    addItemQuantity(product?.categoryid, product?.id);
                  }}
                >
                  <AddIcon />
                </IconButton>
                <Button sx={{ ml: 2 }} size="small">
                  SAVE FOR LATER
                </Button>
                <Button sx={{ ml: 2 }} color="error" size="small">
                  REMOVE
                </Button>
              </Box>
            </Box>
            {cart?.length - 1 !== i ? <Divider sx={{ my: 2 }} /> : null}
          </Box>
        ))}
      </Card>
      <Button
        variant="contained"
        color="warning"
        sx={{ float: "right", my: 8, fontSize: 18 }}
        onClick={() => history.push("/checkout")}
      >
        PLACE ORDER
      </Button>
    </Grid>
  );
};

export default Cart;
