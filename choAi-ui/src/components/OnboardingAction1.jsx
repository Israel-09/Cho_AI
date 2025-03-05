import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import onboarding1 from "@/assets/onboarding1.png";

const OnboardingAction1 = ({ onNext }) => {
  return (
    <>
      <Typography
        sx={{ textAlign: "center", marginBottom: 5, fontSize: "1.2rem" }}
      >
        ASK CHO ANYTHING
        <br />
        GET RESPONSES YOU CAN TRUST
      </Typography>
      <Button fullWidth variant="contained" onClick={onNext}>
        Next
      </Button>
    </>
  );
};

export default OnboardingAction1;
