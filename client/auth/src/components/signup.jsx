import React, { useState } from "react";
import { Box, Button, Grid, Link, TextField, Container, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { signup } from "../apis/auth";

const Signup = () => {
  const history = useHistory();
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
    setTouched(
      requiredFields.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.values(errors).every((err) => !err)) {
      const response = await signup(signupData);
      if (response?.data?.status === 200) {
        history.push("/auth/login");
      }
    }
  };

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
        <form onSubmit={handleSignup}>
          <Box sx={{ pb: 2 }}>
            <Typography variant="h5">Create Account</Typography>
          </Box>
          <Box>
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
              aria-label="Signup"
              tabIndex={0}
              role="button"
            >
              Signup
            </Button>
          </Box>
          <Box>
            <Grid justifyContent={"center"} display={"flex"} sx={{ mt: 2 }}>
              <Link
                href="/auth/login"
                underline="hover"
                sx={{ fontSize: 14 }}
              >
                Already have an account? Login Now!
              </Link>
            </Grid>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
