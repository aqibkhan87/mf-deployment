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
import { login, signup } from "../apis/auth";
import { updateUserIdInCart } from "../apis/cart";

const AuthFormPopup = ({ open, onClose, type = "login" }) => {
  const [formType, setFormType] = useState(type);

  if (formType === "signup")
    return (
      <SignupFormPopup
        open={open}
        onClose={onClose}
        setFormType={setFormType}
      />
    );
  return (
    <LoginFormPopup open={open} onClose={onClose} setFormType={setFormType} />
  );
};

export default AuthFormPopup;

const SignupFormPopup = ({ open, onClose, setFormType }) => {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});

  const requiredFields = ["firstName", "lastName", "email", "password"];

  // Validation
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
    // Add your signup logic here, including mobile number
    setTouched(
      requiredFields.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.values(errors).every((err) => !err)) {
      // setSaving(true);
      // setTimeout(() => setSaving(false), 1200);
      // Actual save/deliver action here
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

const LoginFormPopup = ({ open, onClose, setFormType }) => {
  const { setUser } = useAuthStore();
  const [loginData, setLoginData] = useState({
    contact: "", // combined field for email or mobile
    password: "",
  });
  const [touched, setTouched] = useState({});
  // Validation helpers
  const isEmail = (str) => /\S+@\S+\.\S+/.test(str);
  const isMobile = (str) => /^[0-9]{10}$/.test(str);

  // Validate if contact is valid email or mobile
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
      // setSaving(true);
      // setTimeout(() => setSaving(false), 1200);
      // Actual save/deliver action here
      const userDetails = await login(loginData);
      if (userDetails?.data?.user) {
        localStorage.setItem("user", JSON.stringify(userDetails?.data?.user));
        localStorage.setItem("token", JSON.stringify(userDetails?.data?.token));
        if (localStorage.getItem("cartId")) {
          await updateUserIdInCart(
            userDetails?.data?.user?._id,
            JSON.parse(localStorage.getItem("cartId"))
          );
        }
        setUser(userDetails?.data?.user);
        onClose();
      }
    }
  };

  return (
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
  );
};
