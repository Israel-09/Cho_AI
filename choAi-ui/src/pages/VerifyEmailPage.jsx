import {
  Box,
  Container,
  Icon,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { VerifiedUser } from "@mui/icons-material";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handle email verification sending
  const handleEmailSend = async () => {
    if (user && !user.emailVerified && !isSending) {
      setIsSending(true);
      try {
        await sendEmailVerification(user, {
          url: `${import.meta.env.VITE_APP_URL}/chat`,
          handleCodeInApp: true,
        });
        setResendCooldown(20);
      } catch (error) {
        console.error("Error sending verification email:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  // Check verification status and redirect if verified
  useEffect(() => {
    if (user && user.emailVerified) {
      setSnackbarOpen(true);
      // Redirect to chat page after a short delay to show snackbar
      const timer = setTimeout(() => {
        navigate("/chat");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      handleEmailSend();
    }
  }, [user, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          height: "100vh",
          padding: "5vh 0",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VerifiedUser sx={{ fontSize: "12rem" }} />
          <Typography variant="h5">Please verify your email</Typography>
          <Typography
            variant="body1"
            sx={{ color: "GrayText", textAlign: "center" }}
          >
            A verification email has been sent to your email address.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5vh",
          }}
        >
          <Typography component="p" variant="body1" sx={{ color: "GrayText" }}>
            Having trouble?{" "}
            <Typography
              component="span"
              onClick={resendCooldown === 0 ? handleEmailSend : undefined}
              sx={{
                textDecoration: "underline",
                color: resendCooldown === 0 ? "white" : "gray",
                cursor: resendCooldown === 0 ? "pointer" : "not-allowed",
              }}
            >
              Resend email {resendCooldown > 0 && `(${resendCooldown}s)`}
            </Typography>
          </Typography>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your email is already verified! Redirecting to chat...
        </Alert>
      </Snackbar>
    </>
  );
};

export default VerifyEmailPage;
