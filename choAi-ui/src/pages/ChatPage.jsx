import { Box, Container, useTheme } from "@mui/material";
import React, { useState } from "react";
import AppNavbar from "../components/AppNavbar";
import WelcomeScreen from "../components/WelcomeScreen";
import { useAuth } from "../hooks/useAuth";
import AppHeader from "../components/AppHeader";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const theme = useTheme();
  const isMobile = theme.breakpoints.down("md");
  const minWidth = 80;
  const { user } = useAuth();

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box>{user && <AppNavbar />}</Box>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            padding: 0,
          }}
        >
          <AppHeader />
          <Container
            minWidth="md"
            maxWidth="lg"
            fixed
            sx={{
              padding: 2,
              left: minWidth,
              height: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WelcomeScreen />
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default ChatPage;
