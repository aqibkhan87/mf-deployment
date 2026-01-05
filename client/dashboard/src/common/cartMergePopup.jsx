import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography
} from "@mui/material";
import { useAuthStore } from "store/authStore";
import { updateUserIdInCart } from "../apis/ecommerce/cart";

const cartMergePopup = ({ open, onClose }) => {
    console.log(open, onClose, "open, onClose")
    const { user } = useAuthStore();

    const updateCart = async () => {
        if (localStorage.getItem("cartId")) {
            await updateUserIdInCart(
                user?._id,
                JSON.parse(localStorage.getItem("cartId"))
            );
            await getAllAddresses();
        }
    }
    const cancelMerging = () => {
        updateCart()
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
                        Do you want to merge your existing cart with current cart.
                    </Typography>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={cancelMerging}
                    >
                        No
                    </Button>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleMerge}
                    >
                        Yes
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default cartMergePopup