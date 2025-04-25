import React from "react";
import { Box, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/material/styles";

// Styled components
const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  color: "white",
}));

const RotatingIcon = styled(RefreshIcon)({
  fontSize: 40,
  animation: "spin 2s linear infinite",
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});

const LoadingScreen = () => {
  return (
    <>
      <LoadingContainer>
        <CircularProgress size={60} sx={{ position: "absolute" }} />
      </LoadingContainer>
    </>
  );
};

export default LoadingScreen;
