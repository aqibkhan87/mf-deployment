import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import { login } from "../apis/auth";
import { updateUserIdInCart } from "../apis/cart";

const Login = () => {
  const history = useHistory();
  const { setUser } = useAuthStore();
  const [formdata, setFormData] = useState({
    contact: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  // Validation helpers
  const isEmail = (str) => /\S+@\S+\.\S+/.test(str);
  const isMobile = (str) => /^[0-9]{10}$/.test(str);

  // Validate if usernameValue is valid email or mobile
  const usernameValue = isEmail(formdata.contact) || isMobile(formdata.contact);

  const errors = {
    contact: !usernameValue,
    password: !formdata.password,
  };

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleFormData = (key, value) => {
    setFormData({ ...formdata, [key]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!usernameValue) {
      setTouched((prev) => ({ ...prev, contact: true }));
      return;
    }
    if (!formdata.password) {
      setTouched((prev) => ({ ...prev, password: true }));
      return;
    }

    if (Object.values(errors).every((err) => !err)) {
      const userDetails = await login(formdata);
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
        history.push("/");
      }
    }
  };

  const { password, contact } = formdata;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f6f8fa",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            p: 3,
            border: "1px solid #d0d7de",
            borderRadius: 1,
          }}
        >
          {/* Username */}
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Username or email address
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "white" }}
            label="Email Address or UserName"
            name="contact"
            value={contact}
            onChange={(e) => handleFormData("contact", e?.target?.value)}
            onBlur={() => handleBlur("contact")}
            error={errors.contact && touched.contact}
            helperText={
              touched.contact && errors.contact
                ? "Enter valid email or 10-digit mobile number."
                : ""
            }
          />

          {/* Password */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" fontWeight="bold">
              Password
            </Typography>
            <Link href="#" underline="hover" sx={{ fontSize: 14 }}>
              Forgot password?
            </Link>
          </Box>
          <TextField
            fullWidth
            size="small"
            type="password"
            variant="outlined"
            sx={{ mt: 1, mb: 2, bgcolor: "white" }}
            id="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => handleFormData("password", e?.target?.value)}
            onBlur={() => handleBlur("password")}
            error={errors.password && touched.password}
            helperText={
              touched.password && errors.password ? "Password is required." : ""
            }
          />

          {/* Sign In Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#2da44e",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#218838" },
            }}
            onClick={handleFormSubmit}
          >
            Sign in
          </Button>
          <Link
            href="/auth/signup"
            underline="hover"
            sx={{ fontSize: 14 }}
          >
            Create an account!
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
