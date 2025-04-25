import {
  Container,
  Box,
  Typography,
  TextField,
  Grid2,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "../components/FacebookIcon";
import GoogleIcon from "../components/GoogleIcon";
import AppleIcon from "../components/AppleIcon";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear the error for the changed field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!form.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!form.dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setFeedback({}); // Reset feedback state
    setErrors({}); // Reset errors state
    if (validateForm()) {
      const createUserAndProfile = httpsCallable(functions, "createAccount");
      try {
        setLoading(true);
        const response = await createUserAndProfile({
          name: form.name,
          email: form.email,
          gender: form.gender,
          dob: form.dob,
          password: form.password,
        });
        console.log("User created successfully:", response.data);
        setFeedback({
          message: "Account created successfully!",
          severity: "success",
        });
        login(form.email, form.password);
        setForm({ name: "", email: "", gender: "", dob: "", password: "" });
      } catch (error) {
        console.error("Error creating user:", error);
        setFeedback({
          message: error.message || "Error creating account.",
          severity: "error",
        });
      } finally {
        setLoading(false);
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
      maxWidth="md"
      sx={{ padding: 4, justifyContent: "center", alignItems: "center" }}
    >
      <Box>
        <Typography
          component="h3"
          sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}
        >
          Create an account with CHO <br />
          To enjoy it features NON-STOP
        </Typography>
      </Box>

      {/* Sign up form body */}
      <Grid2
        sx={{
          marginTop: 6,
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
        container
        gap={1}
      >
        <Grid2 size={isMobile ? 12 : 5}>
          <form onSubmit={handleSignup}>
            {" "}
            {/* Added onSubmit handler */}
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              placeholder="Name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email address"
              name="email"
              autoComplete="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <FormControl sx={{ width: "50%" }} error={!!errors.gender}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  fullWidth
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  label="Gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="unknown">Prefer not to say</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>

              <TextField
                sx={{ width: "50%" }}
                id="dob"
                label="Date of Birth"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                error={!!errors.dob}
                helperText={errors.dob}
              />
            </Box>
            {/* Password field in its own FormControl */}
            <FormControl
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.password}
            >
              <InputLabel htmlFor="password-input">Password</InputLabel>
              <OutlinedInput
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="password"
                value={form.password}
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
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {errors.password && (
                <Typography variant="caption" color="error">
                  {errors.password}
                </Typography>
              )}
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
              type="submit" // Changed to submit button
              variant="contained"
              fullWidth
              sx={{ marginY: 2, height: 40 }}
              loading={loading}
            >
              Sign Up
            </Button>
          </form>
          <Typography>
            Already have an account?{" "}
            <Link
              to="/signin"
              style={{
                color: theme.palette.primary.main, // Use theme color
                textDecorationLine: "none",
                fontWeight: 600,
              }}
            >
              <strong>Sign&nbsp;in</strong>
            </Link>{" "}
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
          <Button
            variant="contained"
            startIcon={<AppleIcon />}
            margin="normal"
            sx={{ fontWeight: "600" }}
          >
            Continue with Apple
          </Button>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            sx={{ fontWeight: "600" }}
          >
            Continue with Google
          </Button>
          <Button
            variant="contained"
            startIcon={
              <FacebookIcon sx={{ width: isMobile ? "10px" : "5px" }} />
            }
            sx={{ fontWeight: "600" }}
          >
            Continue with Facebook
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default SignupPage;
