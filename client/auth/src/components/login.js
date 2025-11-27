import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [formdata, setFormData] = useState({
    password: "",
    username: "",
  });

  const history = useHistory();

  const handleFormData = (key, value) => {
    setFormData({ ...formdata, [key]: value });
  };
  
  const handleFormSubmit = () => {
    history.push("/")
  };

  const { password, username } = formdata;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f6f8fa",
      }}
    >
      {/* Main Content */}
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
        {/* Form */}
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
            name="Email Address or UserName"
            value={username}
            onChange={(e) => handleFormData("username", e?.target?.value)}
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
            onClick={() => handleFormSubmit}

          >
            Sign in
          </Button>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 3, width: "100%" }}>or</Divider>

        {/* Continue with Google */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            textTransform: "none",
            bgcolor: "white",
            borderColor: "#d0d7de",
            "&:hover": { bgcolor: "#f6f8fa" },
          }}
        >
          Continue with Google
        </Button>

        {/* Links */}
        <Typography variant="body2" sx={{ mt: 3 }}>
          New to GitHub?{" "}
          <Link href="#" underline="hover">
            Create an account
          </Link>
        </Typography>

        <Link href="#" underline="hover" sx={{ mt: 1, fontSize: 14 }}>
          Sign in with a passkey
        </Link>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          borderTop: "1px solid #d0d7de",
          textAlign: "center",
          fontSize: 14,
          color: "text.secondary",
        }}
      >
        <Link href="#" sx={{ mx: 1 }} underline="hover">
          Terms
        </Link>
        <Link href="#" sx={{ mx: 1 }} underline="hover">
          Privacy
        </Link>
        <Link href="#" sx={{ mx: 1 }} underline="hover">
          Docs
        </Link>
        <Link href="#" sx={{ mx: 1 }} underline="hover">
          Contact GitHub Support
        </Link>
        <Link href="#" sx={{ mx: 1 }} underline="hover">
          Manage cookies
        </Link>
        <Link href="#" sx={{ mx: 1 }} underline="hover">
          Do not share my personal information
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
