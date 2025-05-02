import {
  TextField,
  Typography,
  Container,
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Button,
  Link,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the import path as necessary
import logo from "@/assets/logo.png";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({}); // Reset feedback state
    setErrors({}); // Reset errors state
    if (validateForm()) {
      try {
        await sendPasswordResetEmail(auth, email, {
          url: `${import.meta.env.VITE_APP_URL}/signin`,
          handleCodeInApp: true,
        });
        setFeedback({
          message: "Password reset email sent successfully.",
          severity: "success",
        });
      } catch (error) {
        console.error("Error sending password reset email:", error);
        console.log(error.code);
        if (error.code === "auth/user-not-found") {
          setFeedback({
            message: "No user found with this email address.",
            severity: "error",
          });
        } else if (error.code === "auth/missing-email") {
          setErrors({ email: "Invalid email address." });
        } else {
          setErrors({ email: "Error sending password reset email." });
        }
      }
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFeedback({});
  };
  return (
    <Container
      fixed
      maxWidth="xs"
      sx={{
        display: "flex",
        height: "90vh",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box component={"img"} src={logo} height={"90px"} />
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 700, fontSize: "1.5rem", textAlign: "center" }}
      >
        Reset Password
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1A1A1A",
          width: "95%",
          textAlign: "center",
          paddingY: 0.5,
          fontSize: "0.9rem",
        }}
      >
        Enter your registered email address
      </Box>
      {feedback.message && (
        <Alert
          severity={feedback.severity}
          variant="outlined"
          sx={{ width: "100%", marginTop: "15px" }}
          onClose={handleClose}
        >
          {feedback.message}
        </Alert>
      )}
      <form style={{ width: "100%" }}>
        {/* Email field */}
        <TextField
          fullWidth
          margin="normal"
          label="Email Address"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Continue
        </Button>
      </form>
    </Container>
  );
};

export default ResetPasswordPage;
