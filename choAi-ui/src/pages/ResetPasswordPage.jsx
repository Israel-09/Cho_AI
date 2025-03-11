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

const ResetPasswordPage = () => {
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
        Reset Password
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1A1A1A",
          width: "95%",
          textAlign: "center",
          paddingY: 0.5,
        }}
      >
        Enter your registered email address
      </Box>
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
          value={credentials.email}
          onChange={handleChange}
        />
        <Button fullWidth variant="contained">
          Continue
        </Button>
      </form>
    </Container>
  );
};

export default ResetPasswordPage;
