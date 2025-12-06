import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import { useCartStore } from "store/cartStore";
import { updateQuantity } from "../utils/helper";
import { getCart, updateInCart } from "../apis/cart";

const Cart = () => {
  const history = useHistory();
  const { cart } = useCartStore();

  // console.log("cartrtttrtr in cart", cart);
  const navigateToProduct = (product) => {
    history.push(`/product/${product?.categoryid}/${product?._id}`);
  };

  const addItemQuantity = (categoryid, productid) => {
    const updatedCart = updateQuantity(
      categoryid,
      productid,
      cart?.products,
      "add"
    );
    const existingCartProducts =
      updatedCart?.map(({ productDetail, quantity }) => ({
        _id: productDetail?._id,
        quantity,
      })) || [];
    updateInCart(existingCartProducts);
  };

  const subtractItemQuantity = (categoryid, productid) => {
    const updatedCart = updateQuantity(
      categoryid,
      productid,
      cart?.products,
      "subtract"
    );
    const existingCartProducts =
      updatedCart?.map(({ productDetail, quantity }) => ({
        _id: productDetail?._id,
        quantity,
      })) || [];
    updateInCart(existingCartProducts);
  };

  useEffect(() => {
    getCart();
  }, []);

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
        {cart?.products?.map((product, i) => (
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
              image={product?.productDetail?.productImage}
              alt={product?.productDetail?.name}
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
                  {product?.productDetail?.name}
                </Typography>
                <Typography color="text.secondary">
                  {product?.productDetail?.color}
                </Typography>
                <Typography variant="body2">
                  Seller: {product?.productDetail?.seller}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#888",
                    }}
                  >
                    ₹{product?.productDetail?.actualPrice}
                  </span>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>
                    ₹{product?.productDetail?.price}
                  </span>
                  <span style={{ color: "green", marginLeft: 8 }}>
                    {product?.productDetail?.discountedPrice}
                  </span>
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    subtractItemQuantity(
                      product?.productDetail?.categoryid,
                      product?.productDetail?._id
                    );
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{product?.quantity}</Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    addItemQuantity(
                      product?.productDetail?.categoryid,
                      product?.productDetail?._id
                    );
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
            {cart?.products?.length - 1 !== i ? (
              <Divider sx={{ my: 2 }} />
            ) : null}
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
