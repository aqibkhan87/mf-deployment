import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function GitHubSignup() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "black",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          py: 6,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create your free account
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Explore GitHub's core features for individuals and organizations.
        </Typography>
        <Link href="#" underline="hover" color="inherit">
          See what's included ↓
        </Link>

        {/* Decorative Characters */}
        <Box sx={{ mt: "auto", textAlign: "center" }}>
          <img
            src="https://github.githubassets.com/images/modules/signup/characters.png"
            alt="GitHub Characters"
            style={{ maxWidth: "80%" }}
          />
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#f6f8fa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 6,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              Already have an account?
            </Typography>
            <Link href="#" underline="hover">
              Sign in →
            </Link>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sign up for GitHub
          </Typography>

          {/* Google Signup */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              textTransform: "none",
              bgcolor: "white",
              borderColor: "#d0d7de",
              mb: 2,
              "&:hover": { bgcolor: "#f6f8fa" },
            }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* Form */}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            helperText="Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter."
          />

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            helperText="Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen."
          />

          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Your Country/Region*
          </Typography>
          <Select fullWidth defaultValue="India">
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
          </Select>

          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            For compliance reasons, we're required to collect country information
            to send you occasional updates and announcements.
          </Typography>

          <FormControlLabel
            control={<Checkbox />}
            label="Receive occasional product updates and announcements"
            sx={{ mt: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "black",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#24292f" },
            }}
          >
            Create account →
          </Button>

          <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
            By creating an account, you agree to the{" "}
            <Link href="#" underline="hover">
              Terms of Service
            </Link>
            .
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
