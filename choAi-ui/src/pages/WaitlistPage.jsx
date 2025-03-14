import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const WaitlistPage = () => {
  const theme = useTheme();
  const [lightShade, setLightShade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLightShade((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        component="h1"
        variant="h1"
        sx={{
          fontSize: "3.5rem",
          fontWeight: "600",
          color: lightShade ? "white" : "black",
          WebkitTextStroke: !lightShade && "1px white",
        }}
      >
        Coming Soon!
      </Typography>
      <Box
        sx={{
          marginTop: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: lightShade
            ? "rgba(255, 255, 255, 0.18)"
            : "rgba(211, 211, 211, 0.2)",
          padding: "16px 48px",
          borderRadius: "48px",
          border: "1px solid rgba(211, 211, 211, 1)",
          backdropFilter: "blur(24px)",
        }}
      >
        <Typography
          component="h3"
          variant="h1"
          sx={{ fontSize: "2.5rem", fontWeight: "500" }}
        >
          Good things come <br />
          to those{" "}
          <span
            style={{
              fontFamily: '"David Libre"',
              fontStyle: "italic",
              fontWeight: "300",
              fontSize: "3rem",
            }}
          >
            who wait
          </span>
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: "0.9rem", fontWeight: "400", textAlign: "center" }}
        >
          Join the wailist to be among the first to experience AI-powered
          conversations like never before!
        </Typography>
        <TextField
          fullWidth
          label="Email Address"
          placeholder="Your Email Address"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" size="small" color="primary">
                  Get Notified
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            marginTop: "15px",
            backgroundColor: "black",
            borderRadius: theme.shape.borderRadius,
            boxShadow: !lightShade && "0 4px 8px rgba(61, 61, 61, 1)",
          }}
        />
        <Typography variant="h1" sx={{ fontSize: "0.7rem", marginTop: "5px" }}>
          We respect your privacy. No spam, just updates
        </Typography>
      </Box>
    </Container>
  );
};

export default WaitlistPage;
