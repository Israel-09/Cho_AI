import React, { useEffect, useRef, useState } from "react";
import AppHeader from "../components/AppHeader";
import useChatStore from "../hooks/chatState";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config/firebase";
import InputSection from "../components/InputSection";
import { SchoolRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ResearchAssistantPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { loading, user } = useAuth();
  const aiMode = useChatStore((state) => state.aiMode);
  const navOpen = useChatStore((state) => state.navOpen);
  const setNavOpen = useChatStore((state) => state.setNavOpen);
  const updateAiMode = useChatStore((state) => state.updateAiMode);
  const plagiarismChecked = useChatStore((state) => state.plagiarismChecked);
  const setPlagiarismChecked = useChatStore(
    (state) => state.setPlagiarismChecked
  );
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId
  );
  const conversations = useChatStore((state) => state.conversations);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const createConversation = useChatStore((state) => state.createConversation);
  const chatOption = useChatStore((state) => state.chatOption);
  const isChatting = useChatStore((state) => state.isChatting);
  

  const el = useRef(null);


  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Ask me to summarize articles.",
        "Request research assistance.",
        "Get help with data analysis.",
        "Generate research ideas.",
        "Find relevant literature.",
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    // <Box
    //   sx={{
    //     width: "100vw",
    //     height: isMobile ? "95vh" : "100vh",
    //     display: "flex",
    //     overflow: "hidden",
    //     justifyContent: "center",
    //   }}
    // >
    //   {(navOpen || !isMobile) && (
    //     <AppNavbar
    //       conversations={conversations}
    //       conversationId={currentConversationId}
    //       handleDrawerToggle={handleDrawerToggle}
    //       loading={false}
    //     />
    //   )}
    //   <Stack
    //     direction="column"
    //     sx={{ height: "100%", width: "100%", alignItems: "center" }}
    //   >
    //     <AppHeader
    //       handleDrawerToggle={handleDrawerToggle}
    //       aiMode={aiMode}
    //       handleAiModeChange={handleAiModeChange}
    //       setCurrentConversationId={setCurrentConversationId}
    //     />
    <Box sx={{ flexGrow: 1, background: "", width: "100%" }}>
      <Container
        maxWidth="md"
        sx={{
          background: "",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            mb: 4,
            justifyContent: "center",
          }}
        >
          <SchoolRounded sx={{ fontSize: "7rem" }} />
          <Typography
            variant="h2"
            component="h2"
            ref={el}
            sx={{ fontSize: isMobile ? "1.5rem" : "2.5rem", marginLeft: 2 }}
          />
        </Box>
        <Button
          variant={plagiarismChecked ? "contained" : "text"}
          color="error"
          sx={{ mb: 4 }}
          onClick={() => setPlagiarismChecked(!plagiarismChecked)}
        >
          Use Plagiarism Checker
        </Button>
      </Container>
    </Box>
    //     {/*  <Stack
    //       sx={{
    //         width: isMobile ? "95%" : "100%",
    //         overflowY: "auto",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         display: "flex",
    //         height: "fit-content",
    //       }}
    //     >
    //       <InputSection />
    //     </Stack>
    //   </Stack>
    // </Box> */}
  );
};

export default ResearchAssistantPage;
