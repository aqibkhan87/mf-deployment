import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Rating,
} from "@mui/material";
import { useWishlistStore } from "store/wishlistStore";
import { getWishlistProducts } from "../../apis/wishlist.js";

const ProductWishlisting = () => {
    const history = useHistory();
    const { wishlist } = useWishlistStore();

    const navigateToProductDetail = (e, p) => {
        e.preventDefault();
        history.push(`/product/${p?.product?.categoryid}/${p?.product?._id}`);
    };

    useEffect(() => {
        getWishlistProducts();
    }, []);

    return (
        <Grid item xs={12} md={9} p={{ md: 2, xs: 0 }} >
            <Typography variant="h6" gutterBottom>
                Headset (Showing 1–{wishlist?.length})
            </Typography>

            <Grid container spacing={2}>
                {wishlist?.map((p, i) => (
                    <Grid item xs={12} sm={6} md={4} key={`index-${i}`}>
                        <a onClick={(e) => navigateToProductDetail(e, p)} className="cursor-pointer">
                            <Card sx={{ height: "100%" }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={p?.product?.productImage}
                                    alt={p?.product?.name}
                                    style={{ height: 250 }}
                                />
                                <CardContent>
                                    <Typography variant="body1" gutterBottom>
                                        {p?.product?.name}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Rating
                                            name="rating"
                                            value={Number(p?.product?.rating)}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            ({p?.product?.reviews?.toLocaleString()})
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" color="green">
                                        ₹{p?.product?.price}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ textDecoration: "line-through", mr: 1 }}
                                    >
                                        ₹{p?.product?.actualPrice}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "green", fontWeight: "bold" }}
                                    >
                                        {p?.product?.discountedPrice}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </a>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default ProductWishlisting;
