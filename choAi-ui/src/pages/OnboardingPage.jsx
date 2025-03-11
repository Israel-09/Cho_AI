import {
  Box,
  Button,
  Container,
  Fade,
  MobileStepper,
  Typography,
  Zoom,
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
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginTop: 5,
      }}
    >
      {activeStep === 0 && (
        <Fade in={activeStep === 0} timeout={1000}>
          <Box
            component="img"
            src={onboarding1}
            width="90%"
            sx={{
              top: 0,
            }}
          />
        </Fade>
      )}
      {activeStep === 1 && (
        <Fade in={activeStep === 1} timeout={1500}>
          <Box
            component="img"
            src={onboarding2}
            width="90%"
            sx={{
              position: "relative", // Overlap images
              top: 0,
              left: 0,
            }}
          />
        </Fade>
      )}
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
