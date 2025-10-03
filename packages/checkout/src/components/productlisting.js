import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
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
import { useProductStore } from "store/productStore";
import { getProductByCategory } from "../apis/products.js";

const ProductListing = () => {
  const { categoryid } = useParams();
  const history = useHistory();
  const { productsByCategory } = useProductStore();
  const products = productsByCategory?.products || [];

  const navigateToProductDetail = (e, p) => {
    e.preventDefault();
    history.push(`/product/${categoryid}/${p?._id}`);
  };

  useEffect(() => {
    if (categoryid) getProductByCategory(categoryid);
  }, []);

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
          Headset (Showing 1–{products?.length})
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Button variant="outlined">Popularity</Button>
          <Button>Price -- Low to High</Button>
          <Button>Price -- High to Low</Button>
          <Button>Newest First</Button>
          <Button>Discount</Button>
        </Box>

        <Grid container spacing={2}>
          {products?.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} key={`index-${i}`}>
              <a onClick={(e) => navigateToProductDetail(e, p)}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={p?.productImage}
                    alt={p?.name}
                  />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {p?.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        name="rating"
                        value={Number(p?.rating)}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({p?.reviews?.toLocaleString()})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="green">
                      ₹{p?.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through", mr: 1 }}
                    >
                      ₹{p?.actualPrice}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "green", fontWeight: "bold" }}
                    >
                      {p?.discountedPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </a>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductListing;
