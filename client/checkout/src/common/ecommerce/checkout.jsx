import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  IconButton,
  Chip,
  CardMedia,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCartStore } from "store/cartStore";
import { getCart, updateInCart } from "../../apis/cart";
import { updateQuantity } from "../../utils/helper";

const CheckoutItems = () => {
  const history = useHistory();
  const { cart } = useCartStore();

  useEffect(() => {
    getCart();
  }, []);

  const navigateToProduct = (product) => {
    const productId = product?.productDetail?._id;
    const categoryId = product?.productDetail?.categoryid;
    history.push(`/product/${categoryId}/${productId}`);
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

      {cart?.products?.map((product, ind) => (
        <Grid
          container
          spacing={2}
          key={ind}
        >
          <Grid item xs={2.2}>
            <CardMedia
              component="img"
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                m: 1,
                borderRadius: 2,
              }}
              image={product?.productDetail?.productImage}
              alt={product?.productDetail?.name}
              onClick={() => navigateToProduct(product)}
              className="cursor-pointer"
            />
          </Grid>
          <Grid item xs={9.8}>
            <Typography sx={{ fontWeight: 600 }}
              onClick={() => navigateToProduct(product)}
              className="cursor-pointer"
            >
              {product?.productDetail?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {product?.productDetail?.size}, {product?.productDetail?.color}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seller: {product?.productDetail?.seller}
            </Typography>

            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ₹{product?.productDetail?.price}
              </Typography>
              <Typography variant="body2" color="green">
                {product?.productDetail?.offers} offers available
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
                  subtractItemQuantity(
                    product?.productDetail?.categoryid,
                    product?.productDetail?._id
                  );
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
                  addItemQuantity(
                    product?.productDetail?.categoryid,
                    product?.productDetail?._id
                  );
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
