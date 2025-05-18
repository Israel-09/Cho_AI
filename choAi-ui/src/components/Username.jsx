import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import logo from "@/assets/logo.png";

const Username = ({ handleNext, name, handleChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: isMobile ? "2vh" : "3vh",
        paddingTop: isMobile ? "5vh" : "10vh",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          mb: 2,
          fontWeight: "500",
          fontSize: isMobile ? "1.3rem" : "1.5rem",
        }}
        variant="h4"
        align="left"
      >
        👋 Welcome! What can I call you?
      </Typography>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <TextField
          fullWidth
          name="name"
          required
          placeholder="Your full name"
          value={name}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" onClick={handleNext}>
          Next
        </Button>
      </div>
      <Typography component="p" sx={{ mt: 2, color: "#ccc" }} variant="body2">
        Already Signed up?{" "}
        <a
          href="signin"
          style={{ fontWeight: "500", textDecoration: "none", color: "white" }}
        >
          Sign in Now!
        </a>
      </Typography>
    </Container>
  );
};

export default Username;
