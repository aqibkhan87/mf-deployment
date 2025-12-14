import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import AuthFormPopup from "./authFormPopup";

const LoginSummary = () => {
  const [openPopup, setPopup] = useState(false);
  const [popupType, setPopupType] = useState("login");

  useEffect(() => {
    const handler = (event) => {
      const payload = event.detail;
      setPopup(payload.openPopup);
      setPopupType(payload.popupType);
    };
    window.addEventListener("openLoginPopup", handler);
    return () => {
      window.removeEventListener("openLoginPopup", handler);
    };
  }, []);

  const closeLoginUp = () => {
    setPopup(false);
  };

  if (openPopup) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        {/* LOGIN and SIGNUP PopUp */}
        <AuthFormPopup open={openPopup} onClose={closeLoginUp} type={popupType} />
      </Paper>
    );
  }
  return null;
};

export default LoginSummary;
