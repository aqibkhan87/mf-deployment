import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Grid,
    Link,
} from "@mui/material";
import { useAuthStore } from "store/authStore";
import { login } from "../apis/auth";
import CartMergePopup from "./cartMergePopup";
import { updateUserIdInCart } from "../apis/ecommerce/cart";
import { getAllAddresses } from "../apis/address";

const LoginFormPopup = ({ open, onClose, setFormType }) => {
    const { setUser } = useAuthStore();
    const [loginData, setLoginData] = useState({
        contact: "",
        password: "",
    });
    const [touched, setTouched] = useState({});
    const [openMergePopup, setOpenMergePopup] = useState(false);
    const isEmail = (str) => /\S+@\S+\.\S+/.test(str);
    const isMobile = (str) => /^[0-9]{10}$/.test(str);

    const contactValid =
        isEmail(loginData.contact) || isMobile(loginData.contact);
    const errors = {
        contact: !contactValid,
        password: !loginData.password,
    };

    const handleBlur = (field) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!contactValid) {
            setTouched((prev) => ({ ...prev, contact: true }));
            return;
        }
        if (!loginData.password) {
            setTouched((prev) => ({ ...prev, password: true }));
            return;
        }

        if (Object.values(errors).every((err) => !err)) {
            const userDetails = await login(loginData);
            if (userDetails?.data?.user) {
                localStorage.setItem("user", JSON.stringify(userDetails?.data?.user));
                localStorage.setItem("token", JSON.stringify(userDetails?.data?.token));
                if (userDetails?.data?.cartId) {
                    setOpenMergePopup(true)
                } else {
                    const response = await updateUserIdInCart(
                        user?._id,
                        JSON.parse(localStorage.getItem("cartId")),
                        true
                    );
                    if (response?.data?.cart) {
                        localStorage.setItem("cartId", JSON.stringify(response?.data?.cart?._id));
                    }
                    await getAllAddresses();
                    onClose();
                }
                setUser(userDetails?.data?.user);
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleLogin}>
                        <Box sx={{ mt: 1, maxWidth: 500 }}>
                            <TextField
                                label="Email or Mobile Number"
                                type="text"
                                name="contact"
                                fullWidth
                                margin="normal"
                                value={loginData.contact}
                                onChange={handleChange}
                                onBlur={() => handleBlur("contact")}
                                error={errors.contact && touched.contact}
                                helperText={
                                    touched.contact && errors.contact
                                        ? "Enter valid email or 10-digit mobile number."
                                        : ""
                                }
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                fullWidth
                                margin="normal"
                                value={loginData.password}
                                onChange={handleChange}
                                onBlur={() => handleBlur("password")}
                                error={errors.password && touched.password}
                                helperText={
                                    touched.password && errors.password
                                        ? "Password is required."
                                        : ""
                                }
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Login
                            </Button>
                        </Box>
                    </form>

                    <Box>
                        <Grid justifyContent={"center"} display={"flex"} sx={{ mt: 2 }}>
                            <Link
                                href="#"
                                underline="hover"
                                sx={{ fontSize: 14 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setFormType("signup");
                                }}
                            >
                                Create One
                            </Link>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
            <CartMergePopup open={openMergePopup} onClose={setOpenMergePopup} closeAuthPopup={onClose} />
        </>
    );
};

export default LoginFormPopup;