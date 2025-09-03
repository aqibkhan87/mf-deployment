import React, { useState, useEffect } from "react";

import { Box, Paper, Typography, Grid, Button, Chip } from "@mui/material";
import { useAuthStore } from "store/authStore";
import AuthFormPopup from "auth/authFormPopup";

const LoginSummary = () => {
  const { user } = useAuthStore();
  const [loginPopup, setLoginPopup] = useState(false);

  const handleUserInfo = (value) => {
    setLoginPopup(value);
  };

  const closeLoginUp = () => {
    debugger;
    setLoginPopup(false);
  };

  console.log("!user.email && !loginPopup", !user?.email, !loginPopup);
  return (
    <Paper sx={{ p: 2, mb: 2, }}>
      {/* LOGIN SUMMARY */}
      {loginPopup ? (
        <AuthFormPopup open={loginPopup} onClose={closeLoginUp} />
      ) : null}
      {!user?.email ? (
        <Grid
          container
          alignItems="center"
          spacing={2}
          
        >
          <Grid item>
            <Chip
              label="1"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>LOGIN</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => handleUserInfo(true)}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Chip
              label="1"
              sx={{ background: "#e3ebfd", fontWeight: 600, mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontWeight: 600 }}>
              {user?.name}-{user?.mobile}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default LoginSummary;
