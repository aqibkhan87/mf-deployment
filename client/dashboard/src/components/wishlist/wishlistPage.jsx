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
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWishlistStore } from "store/wishlistStore";
import { useAuthStore } from "store/authStore";
import { getWishlistProducts, deleteItemFromWishlist } from "../../apis/ecommerce/wishlist";

const ProductWishlist = () => {
    const history = useHistory();
    const { wishlist } = useWishlistStore();
    const { user } = useAuthStore();

    const navigateToProductDetail = (e, p) => {
        e.preventDefault();
        history.push(`/product/${p?.product?.categoryid}/${p?.product?._id}`);
    };

    useEffect(() => {
        if (user?.email) getWishlistProducts();
    }, []);

    const handleOnDelete = async (e, p) => {
        e?.preventDefault();
        e?.stopPropagation();
        await deleteItemFromWishlist(p?.product?._id)
    }

    return (
        <Box xs={12} md={9} p={{ md: 2, xs: 0 }} >
            {wishlist?.length ? <Typography variant="h6" gutterBottom>
                Headset (Showing 1–{wishlist?.length})
            </Typography> : <></>}
            <Grid container spacing={2} >
                {wishlist?.length > 0 ? wishlist?.map((p, i) => (
                    <Grid item xs={12} sm={6} md={4} key={`index-${i}`}>
                        <a onClick={(e) => navigateToProductDetail(e, p)} className="cursor-pointer relative">
                            <IconButton
                                onClick={(e) => handleOnDelete(e, p)}
                                className="!absolute"
                                sx={{
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                    },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
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
                )) : <></>
                }
            </Grid>
            {!wishlist?.length ? <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h6" 
                sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    No wishlist Items
                </Typography>
            </Box> : <></>}
        </Box>
    );
};

export default ProductWishlist;
