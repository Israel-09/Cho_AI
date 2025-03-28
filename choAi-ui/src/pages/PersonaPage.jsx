import React, { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const PersonaPage = () => {
  const [selectedRole, setSelectedRole] = useState("Creative");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Selected Role:", selectedRole);
    // Add your submission logic here
  };

  const roles = [
    {
      value: "Student",
      description:
        "Looking for AI assistance with learning, research, and assignments.",
    },
    {
      value: "Professional",
      description:
        "Need AI insights, productivity tools, or industry-specific guidance.",
    },
    {
      value: "Entrepreneur",
      description:
        "Exploring AI for business strategies, automation, and growth.",
    },
    {
      value: "Creative",
      description:
        "Seeking AI-powered inspiration for design, writing, and content creation.",
    },
    {
      value: "Developer",
      description:
        "Interested in AI coding assistance, API integrations, and tech solutions.",
    },
    {
      value: "Casual User",
      description:
        "Just exploring AI for general knowledge and fun interactions.",
    },
  ];

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        padding: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        What best describes you?
      </Typography>
      <Typography variant="body2" sx={{ mb: 6 }}>
        Personalize your AskCho experience.
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup value={selectedRole} onChange={handleRoleChange}>
          {roles.map((role) => (
            <FormControlLabel
              key={role.value}
              value={role.value}
              control={<Radio sx={{ color: "#fff" }} />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    "&:hover": {
                      transition: "transform 0.3s ease",
                    },
                    "&:hover .category-name, &:hover .description": {
                      color: "#e0e0e0",
                      animation: "bounce 0.5s ease",
                    },
                    "@keyframes bounce": {
                      "25%": { transform: "translateX(1.5px)" },
                      "50%": { transform: "translateX(-1.5px)" },
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    className="category-name"
                    width="100px"
                    sx={{
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      fontWeight: "bold",
                      color: selectedRole === role.value ? "" : "#b0b0b0",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {role.value}
                  </Typography>
                  <Typography>-</Typography>
                  <Typography
                    variant="body2"
                    className="description"
                    sx={{
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      color: selectedRole === role.value ? "" : "#b0b0b0",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {role.description}
                  </Typography>
                </Box>
              }
              sx={{ color: "#fff", mb: 1 }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Box width="50%">
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
          size={isMobile ? "small" : "large"}
          fullWidth
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
};

export default PersonaPage;
