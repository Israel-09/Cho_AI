import { Box, Button, Container, Typography, ButtonGroup } from "@mui/material";
import React from "react";
import onboarding1 from "@/assets/onboarding1.png";

const OnboardingAction2 = ({ onNext }) => {
  return (
    <>
      <Typography
        sx={{ textAlign: "center", marginBottom: 5, fontSize: "1.2rem" }}
      >
        Hi, I'm Cho, your Ai buddy
      </Typography>
      <Button fullWidth  variant="contained" onClick={onNext}>
        Try Cho now
      </Button>
      <ButtonGroup
        fullWidth
        variant="contained"
        sx={{ margin: "10px" }}
      >
        <Button>Sign up</Button>
        <Button>Sign in</Button>
      </ButtonGroup>
    </>
  );
};

export default OnboardingAction2;
