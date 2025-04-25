import { AppBar, Box, Container } from "@mui/material";
import React from "react";
import AppNavbar from "../components/AppNavbar";

const ChatPage = () => {
  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2, display: "flex", }}>
        <AppBar position="static" color="default">
          <Box sx={{ padding: 2 }}>
            <h1>Chat with Cho</h1>
          </Box>
        </AppBar>
        {/* Chat component will go here */}
      </Box>
    </>
  );
};

export default ChatPage;
