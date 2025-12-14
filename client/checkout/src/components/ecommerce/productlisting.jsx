import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Slider,
  Divider,
  Button,
  Chip,
  Rating,
} from "@mui/material";
import { useProductStore } from "store/productStore";
import { getProductByCategory } from "../../apis/products.js";
import useDebounce from "../../helper/useDebounce.jsx";

const ProductListing = () => {
  const { categoryid } = useParams();
  const history = useHistory();
  const { productsByCategory } = useProductStore();
  const [ratingFilter, setRatingFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const debouncedPrice = useDebounce(priceRange, 500);

  const navigateToProductDetail = (e, p) => {
    e.preventDefault();
    history.push(`/product/${categoryid}/${p?._id}`);
  };

  useEffect(() => {
    if (categoryid) {
      getProductByCategory(categoryid, {
        minPrice: debouncedPrice[0],
        maxPrice: debouncedPrice[1],
        rating: ratingFilter,
        sortBy,
      });
    }
  }, [debouncedPrice, ratingFilter, sortBy]);

  const handleRatingFilterChange = (value) => {
    setRatingFilter(value)
  }

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
            <Chip
              label="1★ & above"
              sx={{ mr: 1 }}
              color={ratingFilter === 1 ? "primary" : "default"}
              onClick={() => handleRatingFilterChange(ratingFilter === 1 ? null : 1)}
            />
            <Chip
              label="2★ & above"
              sx={{ mr: 1 }}
              color={ratingFilter === 2 ? "primary" : "default"}
              onClick={() => handleRatingFilterChange(ratingFilter === 2 ? null : 2)}
            />
            <Box mb={2} />
            <Chip
              label="3★ & above"
              sx={{ mr: 1 }}
              color={ratingFilter === 3 ? "primary" : "default"}
              onClick={() => handleRatingFilterChange(ratingFilter === 3 ? null : 3)}
            />
            <Chip
              label="4★ & above"
              color={ratingFilter === 4 ? "primary" : "default"}
              onClick={() => handleRatingFilterChange(ratingFilter === 4 ? null : 4)}
            />
          </Box>

          {/* Price Range */}
          <Box mb={2}>
            <Typography gutterBottom>Price</Typography>
            <Slider
              defaultValue={[priceRange[0], priceRange[1]]}
              valueLabelDisplay="auto"
              min={priceRange[0]}
              max={priceRange[1]}
              value={priceRange}
              onChange={(e, v) => setPriceRange(v)}
            />
          </Box>
        </Box>
      </Grid>

      {/* Product Grid */}
      <Grid item xs={12} md={9}>
        <Typography variant="h6" gutterBottom>
          (Showing {productsByCategory?.length > 1 ? 1 : 0}–{productsByCategory?.length})
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Button
            onClick={() => setSortBy("newest")}
            variant={sortBy === "newest" ? "contained" : "outlined"}
          >
            Newest First
          </Button>
          <Button
            onClick={() => setSortBy("price_low")}
            variant={sortBy === "price_low" ? "contained" : "outlined"}
          >
            Price -- Low to High
          </Button>
          <Button
            onClick={() => setSortBy("price_high")}
            variant={sortBy === "price_high" ? "contained" : "outlined"}
          >
            Price -- High to Low
          </Button>
        </Box>

        <Grid container spacing={2}>
          {productsByCategory?.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} key={`index-${i}`}>
              <a
                onClick={(e) => navigateToProductDetail(e, p)}
                className="cursor-pointer"
              >
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={p?.productImage}
                    alt={p?.name}
                    style={{ height: 250 }}
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
