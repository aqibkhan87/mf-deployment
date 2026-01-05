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
import { signup } from "../apis/auth";


const SignupFormPopup = ({ open, onClose, setFormType }) => {
    const [signupData, setSignupData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [touched, setTouched] = useState({});

    const requiredFields = ["firstName", "lastName", "email", "password"];

    const errors = {
        firstName: !signupData.firstName,
        lastName: !signupData.lastName,
        email: !signupData.email,
        password: !signupData.password,
    };

    const handleBlur = (field) => setTouched({ ...touched, [field]: true });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setTouched(
            requiredFields.reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );

        if (Object.values(errors).every((err) => !err)) {
            const response = await signup(signupData);
            if (response?.data?.status === 200) {
                onClose();
            } else {
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Signup</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSignup}>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            label="First Name"
                            type="text"
                            name="firstName"
                            fullWidth
                            margin="normal"
                            required
                            value={signupData.firstName}
                            error={errors.firstName && touched.firstName}
                            helperText={
                                errors.firstName && touched.firstName
                                    ? "Please fill out this field."
                                    : ""
                            }
                            onBlur={() => handleBlur("firstName")}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Last Name"
                            type="text"
                            name="lastName"
                            fullWidth
                            margin="normal"
                            required
                            value={signupData.lastName}
                            error={errors.lastName && touched.lastName}
                            helperText={
                                errors.lastName && touched.lastName
                                    ? "Please fill out this field."
                                    : ""
                            }
                            onBlur={() => handleBlur("lastName")}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            fullWidth
                            margin="normal"
                            required
                            value={signupData.email}
                            error={errors.email && touched.email}
                            helperText={
                                errors.email && touched.email
                                    ? "Please fill out this field."
                                    : ""
                            }
                            onBlur={() => handleBlur("email")}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            fullWidth
                            margin="normal"
                            required
                            value={signupData.password}
                            error={errors.password && touched.password}
                            helperText={
                                errors.password && touched.password
                                    ? "Please fill out this field."
                                    : ""
                            }
                            onBlur={() => handleBlur("password")}
                            onChange={handleChange}
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Signup
                        </Button>
                    </Box>
                    <Box>
                        <Grid justifyContent={"center"} display={"flex"} sx={{ mt: 2 }}>
                            <Link
                                href="#"
                                underline="hover"
                                sx={{ fontSize: 14 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setFormType("login");
                                }}
                            >
                                Already have an account? Login Now!
                            </Link>
                        </Grid>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SignupFormPopup;