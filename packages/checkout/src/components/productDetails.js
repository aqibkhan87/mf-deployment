import React, { useContext, lazy, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { ProductContext } from "store/productContext";
import Recommendations from "./recommendations";
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

const product = {
  name: "HOPPUP Xo6 Gaming Earbuds with 35MS Low Latency, RGB LED, 13MM DRIVERS & 50H PlayTime Bluetooth (Red, True Wireless)",
  price: 797,
  oldPrice: 4999,
  discount: "84% off",
  rating: 4.1,
  reviews: 7515,
  assured: true,
  warranty: "12 Months Warranty from the date of purchase",
  images: [
    "https://rukminim2.flixcart.com/image/612/612/x6gaming.jpg?q=70",
    "https://rukminim2.flixcart.com/image/612/612/x6gaming2.jpg?q=70",
    "https://rukminim2.flixcart.com/image/612/612/x6gaming3.jpg?q=70",
  ],
};

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  console.log("idddddd", id);
  const { products, addToCart, addToWishlist } = useContext(ProductContext);
  // const product = products?.find((p) => p.id.toString() === id);
  const [mainImg, setMainImg] = useState(product.images[0]);

  const handleNavigateToAddToCart = () => {
    history.push('/cart/view')
  }
  
  const handleNavigateToBuyNow = () => {
    history.push('/checkout')
  }

  if (!product) return <p className="p-4">Product not found</p>;
  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <Box p={3}>
        <Grid container spacing={4}>
          {/* LEFT SIDE: Images */}
          <Grid item xs={12} md={5}>
            <Box>
              <img
                src={mainImg}
                alt="product"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Box>
            <Box display="flex" gap={1} mt={2} overflow="auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  style={{
                    width: 60,
                    height: 60,
                    border:
                      mainImg === img ? "2px solid #1976d2" : "1px solid #ddd",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => setMainImg(img)}
                />
              ))}
            </Box>
            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#ff9f00", flex: 1 }}
                startIcon={<span>🛒</span>}
                onClick={() => handleNavigateToAddToCart()}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#fb641b", flex: 1 }}
                startIcon={<span>⚡</span>}
                onClick={() => handleNavigateToBuyNow()}
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
                value={product.rating}
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
                ₹{product.oldPrice}
              </Typography>
              <Typography variant="body1" sx={{ color: "green" }}>
                {product.discount}
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

            {/* Warranty */}
            <Typography variant="body2">{product.warranty}</Typography>

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
      {/* Recommendations */}
      <div className="col-span-2 mt-6">
        <Recommendations
          products={products?.filter((p) => p.id !== product.id)}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
