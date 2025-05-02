import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import WelcomeScreen from "../components/WelcomeScreen";
import { useAuth } from "../hooks/useAuth";
import AppHeader from "../components/AppHeader";
import Conversation from "../components/Conversation";
import InputSection from "../components/InputSection";
import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

import {
  sendGeminiMessage,
  initializeConversation,
} from "../utils/chatResponse";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const createConversation = httpsCallable(functions, "createConversation");
const getConversations = httpsCallable(functions, "getConversations");
const getConversation = httpsCallable(functions, "getConversation");

const ChatPage = () => {
  const { conversationId } = useParams();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [conversationMetadata, setConversationMetadata] = useState(null);
  const [currentConversationId, setCurrentConversationId] =
    useState(conversationId); // Track current conversationId
  const [navOpen, setNavOpen] = useState(false);
  // Get conversationId from URL
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const minWidth = 80;
  const { user } = useAuth();
  const { name } = location.state || {};
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Handle sending messages (both initial and subsequent)
  const handleSend = async (value) => {
    if (!value.trim()) return; // Prevent sending empty messages
    try {
      setIsChatting(true);
      await sendGeminiMessage(
        value,
        setInput,
        messages,
        setMessages,
        setLoading,
        currentConversationId,
        (newConversationId, title) => {
          // Update conversationId and redirect
          setCurrentConversationId(newConversationId);
          setConversations((prev) => [
            { id: newConversationId, title: title || "New Conversation" },
            ...prev,
          ]);
          navigate(`/chat/${newConversationId}`);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  useEffect(() => {
    setCurrentConversationId(conversationId || null);
    console.log(
      "ChatPage: Updated currentConversationId:",
      conversationId || null
    );
  }, [conversationId]);

  // Fetch conversation and messages
  useEffect(() => {
    if (user && conversationId) {
      console.log("ChatPage: Fetching conversation for", conversationId);
      getConversation({ conversationId })
        .then((result) => {
          const { conversation } = result.data;
          setConversationMetadata({
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
          });
          setMessages(conversation.messages || []); // Set messages from response
          console.log(
            "ChatPage: Conversation fetched:",
            conversation.conversationMetadata
          );
        })
        .catch((error) => {
          console.error("Error fetching conversation:", error);
          setError(error.message || "Failed to load conversation");
          setMessages([]); // Ensure empty array on error
        });
    } else {
      setConversationMetadata(null);
      setMessages([]); // Clear messages for no user or conversationId
      console.log("ChatPage: No conversation fetched", {
        user: user?.uid || "none",
        conversationId,
      });
    }
  }, [user, conversationId, conversations]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (user && conversationId) {
      unsubscribe = initializeConversation(
        user.uid,
        conversationId,
        setMessages,
        setError
      );
    } else {
      setMessages([]); // Clear messages for unauthenticated users or no conversationId
    }
    return () => unsubscribe();
  }, [user, conversationId]);

  useEffect(() => {
    if (user) {
      console.log("ChatPage: Fetching conversations for user:", user.uid);
      getConversations()
        .then((result) => {
          setConversations(result.data.conversations);
        })
        .catch((error) => {
          const fetchedConversations = result.data.conversations || [];

          setConversations(fetchedConversations);
        });
    } else {
      setConversations([]);
      console.log("ChatPage: No user, clearing conversations");
    }
  }, []);

  // Handle creating a new conversation
  const handleCreateConversation = async () => {
    if (!user) {
      setError("You must be logged in to create a conversation");
      return;
    }
    try {
      const result = await createConversation({
        title: newConversationTitle || "New Conversation",
      });
      const { conversationId, title } = result.data;
      setConversations((prev) => [
        {
          id: conversationId,
          title: newConversationTitle || "New Conversation",
        },
        ...prev,
      ]);
      setNewConversationTitle("");
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      setError("Failed to create conversation");
    }
  };

  // Handle starting a conversation from WelcomeScreen
  const handleStartConversation = (firstInput) => {
    if (firstInput.trim()) {
      handleSend(firstInput);
    }
  };

  const handleDrawerToggle = () => {
    console.log("ChatPage: Drawer toggled", navOpen);
    setNavOpen(!navOpen);
    console.log("ChatPage: Drawer toggled", navOpen);
  };

  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        width: "100vw",
      }}
    >
      <Box>
        {(!isMobile || navOpen) && (
          <AppNavbar
            conversations={conversations}
            conversationId={conversationId}
            handleDrawerToggle={handleDrawerToggle}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
          />
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90vw",
          overflowY: "auto",
          paddingTop: 2,
        }}
      >
        <AppHeader handleDrawerToggle={handleDrawerToggle} />

        {/* Main content area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            direction: "rtl",
            paddingTop: theme.spacing(4),
            boxSizing: "border-box",
            "> *": {
              direction: "ltr",
              textAlign: "center",
            },
            width: "100%",
            overflowY: "auto",
          }}
        >
          <Container
            minWidth="md"
            maxWidth="lg"
            fixed
            sx={{
              paddingTop: 2,
              left: minWidth,
              height: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 0,
            }}
          >
            {isChatting || conversationId ? (
              <Conversation
                messages={messages}
                setMessages={setMessages}
                loading={loading}
                error={error}
                setError={setError}
              />
            ) : (
              <WelcomeScreen
                name={name}
                onStartConversation={handleStartConversation}
                onFeatureClick={handleSend}
                input={setInput}
              />
            )}
            <Box
              sx={{
                padding: "2 0",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <InputSection
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onEnter={handleSend}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
