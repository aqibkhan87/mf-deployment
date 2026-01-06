import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import { updateUserIdInCart, getCart } from "../apis/ecommerce/cart";

const CartMergePopup = ({ open, onClose }) => {
    const { user } = useAuthStore();
    const history = useHistory();

    const updateCart = async (SyncProducts = true) => {
        if (localStorage.getItem("cartId")) {
            const response = await updateUserIdInCart(
                user?._id,
                JSON.parse(localStorage.getItem("cartId")),
                SyncProducts
            );
            if (response?.data?.cart) {
                localStorage.setItem("cartId", JSON.stringify(response?.data?.cart?._id));
            }
            await getCart();
            history.push("/");
        }
    }
    const cancelMerging = () => {
        updateCart(false)
        onClose()
    }

    const handleMerge = () => {
        updateCart()
        onClose()
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cart Merge</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, maxWidth: 500 }}>
                    <Typography>
                        Do you want to Products from your guest cart to be added to your account cart?
                    </Typography>

                    <Box gap={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={cancelMerging}
                        >
                            No
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={handleMerge}
                        >
                            Yes
                        </Button>
                    </Box>

                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CartMergePopup