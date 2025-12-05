import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  useMediaQuery,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useRef, useEffect, useState, use } from "react";
import AppNavbar from "../components/AppNavbar";
import WelcomeScreen from "../components/WelcomeScreen";
import { useAuth } from "../hooks/useAuth";
import AppHeader from "../components/AppHeader";
import Conversation from "../components/Conversation";
import CreateImageBackground from "../components/CreateImageBackground";
import InputSection from "../components/InputSection";
import { httpsCallable } from "firebase/functions";
import { auth, functions, db } from "../config/firebase";

import { doc, updateDoc } from "firebase/firestore";

import {
  sendGeminiMessage,
  createNewConversation,
  startGuestSession,
} from "../utils/chatResponse";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import useChatStore from "../hooks/chatState";
import ResearchAssistantPage from "./ResearchAssistantPage";

const ChatPage = () => {
  const chatOption = useChatStore((state) => state.chatOption);
  const aiMode = useChatStore((state) => state.aiMode);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId
  );
  const setAiMode = useChatStore((state) => state.setAiMode);
  const setLoading = useChatStore((state) => state.setLoading);
  const loading = useChatStore((state) => state.loading);
  const messages = useChatStore((state) => state.messages);
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const createConversation = useChatStore((state) => state.createConversation);
  const setError = useChatStore((state) => state.setError);
  const error = useChatStore((state) => state.error);

  const { conversationId } = useParams();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const hasMessages = messages && messages.length > 0;

  // fetch route options

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const minWidth = 80;
  const { user, loading: authLoading } = useAuth();
  const { name } = location.state || {};
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const messagesEndRef = useRef(null);

  const handleRegenerate = async (failedMessageId) => {
    if (isRegenerating) return; // Prevent multiple clicks

    setIsRegenerating(true);
    setError(null);

    const failedMessageRef = doc(
      db,
      "conversations",
      currentConversationId,
      "messages",
      failedMessageId
    );
    await updateDoc(failedMessageRef, { status: "regenerating" });

    const userMessageBefore = messages
      .slice(
        0,
        messages.findIndex((msg) => msg.id === failedMessageId)
      )
      .reverse()
      .find((msg) => msg.sender === "user");

    console.log("Found previous user message:", userMessageBefore);

    if (!userMessageBefore) {
      setError("No previous user message found for regeneration.");
      setIsRegenerating(false);
      return;
    }

    try {
      await sendGeminiMessage(
        userMessageBefore.text,
        setLoading,
        aiMode,
        currentConversationId,
        true,
        [],
        chatOption,
        failedMessageId
      );
    } catch (error) {
      console.error("Error regenerating message:", error);
      setError("Failed to regenerate message");
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId);
      fetchMessages(conversationId);
      return;
    }
    if (!currentConversationId) {
      console.log("No currentConversationId, creating new conversation");
      createConversation(user ? user.uid : null);
      return;
    }
  }, [conversationId, user]);

  useEffect(() => {
    if (user) {
      fetchConversations(user.uid);
    }
  }, [user]);

  const handleAiModeChange = async (event) => {
    const newMode = event.target.value;
    setAiMode(newMode);
    // update the conversation record with the new mode
    if (currentConversationId) {
      const conversationRef = doc(db, "conversations", currentConversationId);
      await updateDoc(conversationRef, { aiMode: newMode });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  useEffect(() => {
    console.log("Chat option changed:", chatOption);
    console.log("has messages:", hasMessages);
  }, [chatOption]);

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: isMobile ? "100dvh" : "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box>
        <AppNavbar />
      </Box>
      <Stack
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          sx={{
            height: isMobile ? "60px" : "70px",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppHeader
            aiMode={aiMode}
            handleAiModeChange={handleAiModeChange}
            setCurrentConversationId={setCurrentConversationId}
          />
        </Stack>
        {hasMessages ? (
          <>
            <Stack
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                paddingTop: isMobile ? 1 : 2,
                paddingBottom: "5px",
                width: "100%",
                height: "100%",

                maskImage:
                  "linear-gradient(to bottom, black 90%, transparent 100%)",
              }}
            >
              <Conversation
                loading={loading}
                error={error}
                setError={setError}
                onRegenerate={handleRegenerate}
              />
            </Stack>
            <Stack
              sx={{
                width: "100%",
                alignItems: "center",
                position: "relative",
                marginBottom: isMobile ? 2 : 3,
              }}
            >
              <InputSection />
            </Stack>
          </>
        ) : (
          <>
            {chatOption === "imageGen" ? (
              <Stack
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  paddingX: isMobile ? "10px" : 3,
                  paddingTop: isMobile ? 1 : 2,
                  paddingBottom: isMobile ? 8 : 4,
                  alignItems: "center",
                  position: "relative",
                  maskImage:
                    "linear-gradient(to bottom, black 90%, transparent 100%)",

                  overflowY: "auto",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#555",
                    borderRadius: "4px",
                    maxHeight: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#aaa",
                  },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <CreateImageBackground />
                </Box>
              </Stack>
            ) : chatOption === "researchAssistant" ? (
              <Stack
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  paddingX: isMobile ? "10px" : 3,
                  paddingTop: isMobile ? 1 : 2,
                  paddingBottom: isMobile ? 8 : 4,
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <ResearchAssistantPage />
              </Stack>
            ) : (
              <Stack
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  overflowY: "auto",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#555",
                    borderRadius: "4px",
                    maxHeight: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#aaa",
                  },
                }}
              >
                <WelcomeScreen name={name} />
              </Stack>
            )}
            <Stack
              sx={{
                width: "100%",
                alignItems: "center",
                position: "relative",
                marginBottom: isMobile ? 2 : 3,
                marginTop: 2,
              }}
            >
              <InputSection />
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ChatPage;
