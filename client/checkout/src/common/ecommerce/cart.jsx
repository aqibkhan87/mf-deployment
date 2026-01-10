import React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCartStore } from "store/cartStore";
import { useAuthStore } from "store/authStore";
import { updateQuantity } from "../../utils/helper";
import { updateInCart, removeItemFromCart } from "../../apis/ecommerce/cart";
import { addToWishlist } from "../../apis/ecommerce/wishlist";

const Cart = () => {
  const history = useHistory();
  const { cart, cartCount } = useCartStore();
  const { user } = useAuthStore();

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

  const navigateToCheckout = () => {
    history.push("/ecommerce/checkout");
  }

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    await addToWishlist(product?.productDetail?._id);
  }

  const handleRemoveItemFromCart = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    await removeItemFromCart(product?.productDetail?._id);
  }

  return (
    <Grid>
      <Typography variant="h5" gutterBottom>
        Items in Cart: {cartCount ? (cartCount) : ""}
      </Typography>

      <Card>
        {cart?.products?.map((product, i) => (
          <Box
            key={i}
            sx={{ display: "flex", mb: 2 }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                m: 2,
                borderRadius: 2,
                cursor: "pointer"
              }}
              image={product?.productDetail?.productImage}
              alt={product?.productDetail?.name}
              onClick={() => navigateToProduct(product)}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" noWrap
                  onClick={() => navigateToProduct(product)}
                  sx={{ cursor: "pointer" }}>
                  {product?.productDetail?.name}
                </Typography>
                <Typography color="text.secondary">
                  {product?.productDetail?.color}
                </Typography>
                <Typography variant="body2">
                  Seller: {product?.productDetail?.seller}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      color: "#888",
                    }}
                  >
                    ₹{product?.productDetail?.actualPrice}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, marginLeft: 0 }}>
                    ₹{product?.productDetail?.price}
                  </Typography>
                  <Typography sx={{ color: "green", marginLeft: 0 }}>
                    {product?.productDetail?.discountedPrice}
                  </Typography>
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
                <Button
                  sx={{ ml: 2 }}
                  size="small"
                  disabled={!user.email}
                  onClick={(e) => handleAddToWishlist(e, product)}
                  aria-label="Add To Wishlist"
                  tabIndex={0}
                  role="button"
                >
                  Add To Wishlist
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  color="error"
                  size="small"
                  onClick={(e) => handleRemoveItemFromCart(e, product)}
                  aria-label="Remove Item From Cart"
                  tabIndex={0}
                  role="button"
                >
                  Remove
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
        type="submit"
        color="primary"
        sx={{ float: "right", my: 8, fontSize: 18, textTransform: "none" }}
        onClick={navigateToCheckout}
        aria-label="Proceed To Checkout"
      >
        Proceed to checkout
      </Button>
    </Grid>
  );
};

export default Cart;
