import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  Divider,
  TextField,
} from "@mui/material";
import { useCartStore } from "store/cartStore";
import { useProductStore } from "store/productStore";
import { getProductById, getProductByCategory } from "../../apis/products.js";
import { addToCart } from "../../apis/cart.js";
import Recommendations from "../../common/ecommerce/recommendations";


const ProductDetail = () => {
  const history = useHistory();
  const { categoryid, productid } = useParams();
  const { cart } = useCartStore();
  const { product, productsByCategory } = useProductStore();
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (productid) getProductById(productid);
    if (categoryid) getProductByCategory(categoryid);
  }, []);

  const handleNavigateToAddToCart = async (e) => {
    e.preventDefault();
    const existingCartProducts =
      cart?.products?.map(({ productDetail, quantity }) => ({
        _id: productDetail?._id,
        quantity,
      })) || [];

    // Find if current product exists in cart
    const existingItem = existingCartProducts.find(
      (item) => item._id === productid
    );
    if (existingItem) {
      // Increase quantity by 1
      const updatedProducts = existingCartProducts.map((item) =>
        item._id === productid ? { ...item, quantity: item.quantity + 1 } : item
      );

      // Send the entire updated cart to backend
      await addToCart(updatedProducts);
    } else {
      // Add new product with quantity 1
      const newProduct = {
        _id: productid,
        quantity: 1,
      };

      const updatedProducts = [...existingCartProducts, newProduct];

      // Send updated cart including new product
      await addToCart(updatedProducts);
    }

    history.push("/cart/view");
  };

  const handleNavigateToBuyNow = async (e) => {
    e.preventDefault();
    const existingCartProducts =
      cart?.products?.map(({ productDetail, quantity }) => ({
        _id: productDetail?._id,
        quantity,
      })) || [];

    // Find if current product exists in cart
    const existingItem = existingCartProducts.find(
      (item) => item._id === productid
    );
    if (existingItem) {
      // Increase quantity by 1
      const updatedProducts = existingCartProducts.map((item) =>
        item._id === productid ? { ...item, quantity: item.quantity + 1 } : item
      );

      // Send the entire updated cart to backend
      await addToCart(updatedProducts);
    } else {
      // Add new product with quantity 1
      const newProduct = {
        _id: productid,
        quantity: 1,
      };

      const updatedProducts = [...existingCartProducts, newProduct];

      // Send updated cart including new product
      await addToCart(updatedProducts);
    }
    history.push("/ecommerce/checkout");
  };

  if (!product) return <p className="p-4">Product not found</p>;
  return (
    <div>

      <div className="p-6 grid grid-cols-1 gap-6">
        <Box p={3}>
          <Grid container spacing={4}>
            {/* LEFT SIDE: Images */}
            <Grid item xs={12} md={5}>
              <Box display="flex">
                <Box display="grid" gap={2} mt={2}>
                  {product?.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      style={{
                        width: 100,
                        height: 100,
                        border:
                          mainImg === img
                            ? "2px solid #1976d2"
                            : "1px solid #ddd",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => setMainImg(img)}
                    />
                  ))}
                </Box>
                <Box
                  display="flex"
                  style={{ width: "calc(100% - 140px)", height: 450 }}
                  mx={"auto"}
                  mt={2}
                >
                  <img
                    src={
                      mainImg
                        ? mainImg
                        : product?.images?.length
                          ? product?.images[0]
                          : ""
                    }
                    alt="product"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Box>
              </Box>

              <Box mt={3} display="flex" gap={2}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#ff9f00", flex: 1 }}
                  startIcon={<span>🛒</span>}
                  onClick={(e) => handleNavigateToAddToCart(e)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#fb641b", flex: 1 }}
                  startIcon={<span>⚡</span>}
                  onClick={(e) => handleNavigateToBuyNow(e)}
                >
                  Buy Now
                </Button>
              </Box>
            </Grid>

            {/* RIGHT SIDE: Product Info */}
            <Grid item xs={12} md={7}>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating
                  value={Number(product.rating)}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {product.rating} ★ ({product.reviews} Ratings & Reviews)
                </Typography>
                {product.assured && (
                  <Chip label="Assured" size="small" color="primary" />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Section */}
              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography variant="h5" color="green">
                  ₹{product.price}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  ₹{product.actualPrice}
                </Typography>
                <Typography variant="body1" sx={{ color: "green" }}>
                  {product.discountedPrice}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                + ₹19 Protect Promise Fee
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Offers */}
              <Typography variant="subtitle1" gutterBottom>
                Available offers
              </Typography>
              <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                <li>Bank Offer: 5% cashback on Flipkart Axis Bank Credit Card</li>
                <li>
                  Bank Offer: 5% cashback on Axis Bank Debit Card up to ₹750
                </li>
                <li>Partner Offer: Earn 25 Supercoins using BHIM UPI</li>
              </ul>
              <Typography sx={{ color: "primary.main", cursor: "pointer" }}>
                View 6 more offers
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Delivery Check */}
              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  label="Enter Pincode"
                  size="small"
                  variant="outlined"
                  sx={{ width: 150 }}
                />
                <Button variant="outlined">Check</Button>
              </Box>
              <Typography variant="body2" mt={1}>
                Delivery in <b>2 Days, Friday</b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
      {/* Recommendations */}
      <div className="col-span-2 mt-6">
        <Recommendations
          products={productsByCategory?.products?.filter(
            (p) => p._id !== product._id
          )}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
