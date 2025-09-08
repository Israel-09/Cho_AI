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
  Grid2,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../hooks/useAuth";
import logo from "@/assets/logo.png";
import FacebookIcon from "../components/FacebookIcon";
import GoogleIcon from "../components/GoogleIcon";
import AppleIcon from "../components/AppleIcon";
import { signInWithGoogle, signInWithFacebook } from "../utils/authManager";

const SigninPage = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    setLoading(true);
    setFeedback({}); // Reset feedback state
    e.preventDefault();
    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      console.error("Login failed:", error);
      if (error.code === "auth/user-not-found") {
        setFeedback({
          message: "User not found. Please check your email.",
          severity: "error",
        });
      } else if (error.code === "auth/wrong-password") {
        setFeedback({
          message: "Incorrect password. Please try again.",
          severity: "error",
        });
      } else {
        setFeedback({
          message: "Login failed. Please check your credentials.",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFeedback({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container
      fixed
      maxWidth="md"
      sx={{
        padding: 5,
        display: "flex",
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
        mt="4"
        sx={{ fontWeight: 700, fontSize: "2rem", textAlign: "center" }}
      >
        Sign in
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1A1A1A",
          width: "95%",
          textAlign: "center",
          paddingY: 0.5,
        }}
      >
        Sign in with your email here
      </Box>
      <Grid2
        sx={{
          marginTop: 3,
          alignItems: "center",
          width: "95%",
          justifyContent: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
        container
        gap={1}
      >
        <Grid2 size={isMobile ? 12 : 5}>
          <form style={{ width: "100%" }}>
            {/* Email field */}
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={credentials.email}
              onChange={handleChange}
            />

            {/* Password field in its own FormControl */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="password-input">Password</InputLabel>
              <OutlinedInput
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                autoComplete="password"
                value={credentials.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      disabled={loading}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
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
            <Button
              fullWidth
              variant="contained"
              sx={{ marginTop: "12px" }}
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              Sign in
            </Button>
          </form>
          <Typography color="text.secondary">
            Forgot Password?{" "}
            <a
              href="/reset-password"
              style={{
                color: "white",
                textDecorationLine: "none",
                fontWeight: 600,
              }}
            >
              Reset
            </a>
          </Typography>
          <Typography color="text.secondary">
            Dont't have an account yet?{" "}
            <a
              href="/signup"
              style={{
                color: "white",
                textDecorationLine: "none",
                fontWeight: 600,
              }}
            >
              Sign up
            </a>
          </Typography>
        </Grid2>
        <Grid2
          size={1}
          display="flex"
          justifyContent="center"
          marginY={isMobile ? 3 : 1}
        >
          <Typography>OR</Typography>
        </Grid2>
        <Grid2
          size={isMobile ? 12 : 5}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* <Button
            variant="contained"
            startIcon={<AppleIcon />}
            margin="normal"
            sx={{ fontWeight: "600" }}
          >
            Continue with Apple
          </Button> */}
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            sx={{ fontWeight: "600" }}
            onClick={signInWithGoogle}
          >
            Continue with Google
          </Button>
          {/* <Button
            variant="contained"
            startIcon={
              <FacebookIcon sx={{ width: isMobile ? "10px" : "5px" }} />
            }
            sx={{ fontWeight: "600" }}
            onClick={signInWithFacebook}
          >
            Continue with Facebook
          </Button> */}
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default SigninPage;
