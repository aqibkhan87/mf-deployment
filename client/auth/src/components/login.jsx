import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "store/authStore";
import { login } from "../apis/auth";
import { updateUserIdInCart } from "../apis/ecommerce/cart";
import CartMergePopup from "./cartMergePopup";

const Login = () => {
  const history = useHistory();
  const { setUser } = useAuthStore();
  const [formdata, setFormData] = useState({
    contact: "",
    password: "",
  });
  const [openMergePopup, setOpenMergePopup] = useState(false);
  const [touched, setTouched] = useState({});
  const isEmail = (str) => /\S+@\S+\.\S+/.test(str);
  const isMobile = (str) => /^[0-9]{10}$/.test(str);

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
          history.push("/");
        }
        setUser(userDetails?.data?.user);
      }
    }
  };

  const { password, contact } = formdata;
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          p: 3,
          border: "1px solid #d0d7de",
          borderRadius: 1,
          marginTop: 4
        }}
        className="w-100 bg-white border-1 mt-16"
      >
        <Box sx={{ pb: 2 }}>
          <Typography variant="h5">Login</Typography>
        </Box>
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

        <TextField
          fullWidth
          size="small"
          type="password"
          variant="outlined"
          sx={{ mt: 1, mb: 2, bgcolor: "white" }}
          label="Password"
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
        <Box sx={{ display: "flex", justifyContent: "end", pb: 2 }}>
          <Link href="#" underline="hover" sx={{ fontSize: 14 }}>
            Forgot password?
          </Link>
        </Box>

        {/* Sign In Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleFormSubmit}
          aria-label="Sign In"
          role="button"
          tabIndex={0}
        >
          Sign in
        </Button>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Link
            href="/auth/signup"
            underline="hover"
            sx={{ fontSize: 14 }}
            aria-label="Create an account"
            role="link"
          >
            Create an account!
          </Link>
        </Box>
      </Box>
      <CartMergePopup open={openMergePopup} onClose={setOpenMergePopup} />
    </Container>
  );
};

export default Login;
