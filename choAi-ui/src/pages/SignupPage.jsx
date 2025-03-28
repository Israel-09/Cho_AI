import {
  Container,
  Box,
  Typography,
  TextField,
  Grid2,
  Button,
  InputAdornment,
  IconButton,
  FilledInput,
  OutlinedInput,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "../components/FacebookIcon";
import GoogleIcon from "../components/GoogleIcon";
import AppleIcon from "../components/AppleIcon";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
          <form>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              placeholder="Name"
              autoComplete="name"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email address"
              name="email"
              autoComplete="email"
              placeholder="Email address"
              required
            />
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <FormControl sx={{ width: "50%" }}>
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
                  <MenuItem value="unknown">Prefer not to say</MenuItem>{" "}
                  {/* Fixed typo */}
                </Select>
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
                inputProps={{ max: new Date().toISOString().split("T")[0] }} // Optional: restrict future dates
              />
            </Box>

            {/* Password field in its own FormControl */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="password-input">Password</InputLabel>
              <OutlinedInput
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="password"
                required
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
            </FormControl>
            <Button
              variant="contained"
              fullWidth
              sx={{ marginY: 2, height: 40 }}
            >
              Sign Up
            </Button>
          </form>
          <Typography>
            Already have an account?{" "}
            <a
              href="/signin"
              style={{
                color: "white",
                textDecorationLine: "none",
                fontWeight: 600,
              }}
            >
              <strong color="secondary">Sign&nbsp;in</strong>
            </a>{" "}
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
