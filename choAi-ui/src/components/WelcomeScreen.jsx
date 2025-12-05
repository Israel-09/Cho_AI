import {
  Box,
  Container,
  Grid2,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, memo } from "react";
import FeatureCard from "./FeatureCard";
import { useAuth } from "../hooks/useAuth";
import useChatStore from "../hooks/chatState";

const WelcomeScreen = ({ name = "", onFeatureClick }) => {
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Adjust this value as needed

  const formatUsername = (name) => {
    const names = name.split(" ");
    let formatName;
    if (names.length === 1) {
      formatName = names[0].charAt(0).toUpperCase() + names[0].slice(1);
    } else if (names.length > 1) {
      formatName =
        names[0].charAt(0).toUpperCase() +
        names[0].slice(1) +
        " " +
        names[1].charAt(0).toUpperCase() +
        names[1].slice(1);
    }
    console.log(formatName, names);
    return formatName;
  };

  return (
    <Container
      container
      sx={{
        width: "100%",
        paddingTop: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <FeatureCard onFeatureClick={onFeatureClick} />
      {/* header section */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.5rem",
            textAlign: "center",
            fontWeight: "700",
            margin: 0,
            background:
              "-webkit-linear-gradient(left, rgba(255, 255, 255, 1), rgba(153, 153, 153, 1))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          aria-label={`Greeting for ${user ? user.displayName : "Guest"}`}
        >
          {"Hello"}{" "}
          {user ? formatUsername(user.displayName) : formatUsername(name)}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color="rgba(153, 153, 153, 1)"
          sx={{
            marginTop: -1,
            fontSize: "0.9rem",
            textAlign: "center",
            textTransform: "none",
          }}
        >
          How can I help you today?
        </Typography>
      </Box>
    </Container>
  );
};

export default memo(WelcomeScreen);
