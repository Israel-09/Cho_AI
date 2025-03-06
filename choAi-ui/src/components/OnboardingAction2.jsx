import { Box, Button, Container, Typography, ButtonGroup } from "@mui/material";
import React from "react";
import onboarding1 from "@/assets/onboarding1.png";
import { Navigate, useNavigate } from "react-router-dom";

const OnboardingAction2 = ({ onNext }) => {
  const navigate = useNavigate();

  return (
    <>
      <Typography
        sx={{ textAlign: "center", marginBottom: 5, fontSize: "1.2rem" }}
      >
        Hi, I'm Cho, your Ai buddy
      </Typography>
      <Button fullWidth variant="contained" onClick={onNext}>
        Try Cho now
      </Button>
      <ButtonGroup fullWidth variant="contained" sx={{ margin: "10px" }}>
        <Button
          onClick={() => {
            navigate("/signup");
          }}
        >
          Sign up
        </Button>
        <Button
          onClick={() => {
            navigate("/signin");
          }}
        >
          Sign in
        </Button>
      </ButtonGroup>
    </>
  );
};

export default OnboardingAction2;
