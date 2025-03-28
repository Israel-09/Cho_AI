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
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SigninPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
      maxWidth="xs"
      sx={{
        height: "100vh",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
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
                    showPassword ? "hide the password" : "display the password"
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
        <Button fullWidth variant="contained" sx={{ marginTop: "12px" }}>
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
    </Container>
  );
};

export default SigninPage;
