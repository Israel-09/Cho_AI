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
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PersonaPage = ({ name }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = () => {
    navigate("/chat", { state: { name: name } });
  };

  if (isMobile) {
    navigate("/chat", { state: { name: name } });
  }
  const roles = [
    {
      value: "Student",
      description: "Ace Assignments & Researches with AI.",
    },
    {
      value: "Professional",
      description: "Boost Productivity with AI.",
    },
    {
      value: "Entrepreneur",
      description: "Grow Your Business with AI.",
    },
    {
      value: "Creative",
      description: "Create with AI.",
    },
    {
      value: "Developer",
      description: "Code with Ai",
    },
    {
      value: "Casual User",
      description: "Chat with AI.",
    },
  ];

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
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
                <Grid2
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    "&:hover": {
                      transition: "transform 0.3s ease",
                    },
                    "&:hover .category-name, &:hover .description": {
                      color: "#fff",
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
                </Grid2>
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
