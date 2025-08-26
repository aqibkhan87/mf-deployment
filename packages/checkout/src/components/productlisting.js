import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Button,
  Chip,
  Rating,
} from "@mui/material";

const products = [
  {
    id: 1,
    name: "HOPPUP Xo6 Gaming Earbuds",
    price: 797,
    oldPrice: 4999,
    rating: 4.1,
    reviews: 7515,
    image: "https://rukminim2.flixcart.com/image/312/312/x6gaming.jpg?q=70", // replace with actual image
    discount: "84% off",
    assured: true,
  },
  {
    id: 2,
    name: "TRIGGR Kraken X4",
    price: 799,
    oldPrice: 3999,
    rating: 4,
    reviews: 20220,
    image: "https://rukminim2.flixcart.com/image/312/312/krakenx4.jpg?q=70",
    discount: "80% off",
    assured: true,
  },
  {
    id: 3,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 4,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 5,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 6,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 7,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 8,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 9,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 10,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
  {
    id: 11,
    name: "bAot EarBuds BT110",
    price: 699,
    oldPrice: 1999,
    rating: 4.1,
    reviews: 8,
    image: "https://rukminim2.flixcart.com/image/312/312/bAotbt110.jpg?q=70",
    discount: "65% off",
    assured: true,
  },
];

const ProductListing = () => {
  return (
    <Grid container spacing={2} p={2}>
      {/* Sidebar Filters */}
      <Grid item xs={12} md={3}>
        <Box p={2} border="1px solid #ddd" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          {/* Rating Filter */}
          <Box mb={2}>
            <Chip label="3★ & above" color="primary" sx={{ mr: 1 }} />
            <Chip label="4★ & above" color="primary" />
          </Box>

          {/* Bluetooth & True Wireless */}
          <Box mb={2}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Bluetooth"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="True Wireless"
            />
          </Box>

          {/* Price Range */}
          <Box mb={2}>
            <Typography gutterBottom>Price</Typography>
            <Slider
              defaultValue={[500, 10000]}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Headphone Type */}
          <Typography gutterBottom>Headphone Type</Typography>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="True Wireless"
          />
          <FormControlLabel control={<Checkbox />} label="In the Ear" />
          <FormControlLabel control={<Checkbox />} label="On the Ear" />
        </Box>
      </Grid>

      {/* Product Grid */}
      <Grid item xs={12} md={9}>
        <Typography variant="h6" gutterBottom>
          Headset (Showing 1–{products.length})
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Button variant="outlined">Popularity</Button>
          <Button>Price -- Low to High</Button>
          <Button>Price -- High to Low</Button>
          <Button>Newest First</Button>
          <Button>Discount</Button>
        </Box>

        <Grid container spacing={2}>
          {products?.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Link to="/product/details/123">
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={p.image}
                    alt={p.name}
                  />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {p.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        name="rating"
                        value={p.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({p.reviews.toLocaleString()})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="green">
                      ₹{p.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through", mr: 1 }}
                    >
                      ₹{p.oldPrice}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "green", fontWeight: "bold" }}
                    >
                      {p.discount}
                    </Typography>
                    {p.assured && (
                      <Chip
                        label="Assured"
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductListing;
