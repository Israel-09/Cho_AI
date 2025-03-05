import {
  Box,
  Button,
  Container,
  MobileStepper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import onboarding1 from "@/assets/onboarding1.png";
import onboarding2 from "@/assets/onboarding2.png";
import OnboardingAction1 from "../components/OnboardingAction1";
import OnboardingAction2 from "../components/OnboardingAction2";

const OnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = 2;

  const handleNext = () => setActiveStep((prev) => prev + 1);

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 5,
      }}
    >
      <Box
        component="img"
        src={activeStep == 0 ? onboarding1 : onboarding2}
        height={400}
      />
      <MobileStepper
        variant="dots"
        steps={totalSteps}
        activeStep={activeStep}
        position="static"
        sx={{ margin: "20px 0" }}
      />
      {activeStep == 0 ? (
        <OnboardingAction1 onNext={handleNext} />
      ) : (
        <OnboardingAction2 />
      )}
    </Container>
  );
};

export default OnboardingPage;
