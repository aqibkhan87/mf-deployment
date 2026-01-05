import React, { useState } from "react";
import SignupFormPopup from "./signupFormPopup";
import LoginFormPopup from "./loginFormPopup";

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