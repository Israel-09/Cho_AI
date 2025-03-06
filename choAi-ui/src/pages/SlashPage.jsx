import { Container, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const SlashPage = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4000);

    const redirectTimer = setTimeout(() => {
      setShouldRedirect(true);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/onboarding" replace={false} />;
  }

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: isExiting ? "fadeOut 20s ease" : "none",
      }}
      maxWidth="xs"
    >
      <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "2rem" }}>
        ASKCHO.AI
      </Typography>
      <LinearProgress
        variant="indeterminate"
        sx={{
          width: "80%",
          zIndex: 1,
          margin: 5,
        }}
      />
    </Container>
  );
};

export default SlashPage;
