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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "../config/firebase";

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
  const [aiMode, setAiMode] = useState(() => {
    const storedMode = localStorage.getItem("aiMode");
    return storedMode ? JSON.parse(storedMode) : "proAssistant";
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [responseHistory, setResponseHistory] = useState([]); // Store bot responses for the last user message
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0); // Track current response
  const [isChatting, setIsChatting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [conversationMetadata, setConversationMetadata] = useState(null);
  const [currentConversationId, setCurrentConversationId] =
    useState(conversationId);
  const [navOpen, setNavOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const minWidth = 80;
  const { user } = useAuth();
  const { name } = location.state || {};
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSend = async (value, files = []) => {
    console.log("Files", files);
    if (!value.trim()) return;
    setResponseHistory([]);
    setCurrentResponseIndex(0);
    try {
      setIsChatting(true);
      await sendGeminiMessage(
        value,
        setInput,
        messages,
        setMessages,
        setLoading,
        aiMode,
        currentConversationId,
        (newConversationId, title) => {
          setCurrentConversationId(newConversationId);
          setConversations((prev) => [
            { id: newConversationId, title: title || "New Conversation" },
            ...prev,
          ]);
          navigate(`/chat/${newConversationId}`);
        },
        false,
        setResponseHistory,
        files
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  const handleFileUpload = async (files) => {
    if (!user) return;

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `users/${user.uid}/files/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return { name: file.name, url: downloadURL, type: file.type };
      })
    );

    setMessages((prev) => [
      ...prev,
      ...uploadedFiles.map((file) => ({
        sender: "user",
        text: "",
        fileName: file.name,
        fileUrl: file.url,
        fileType: file.type,
      })),
    ]);
  };

  useEffect(() => {
    setCurrentConversationId(conversationId || null);
    console.log(
      "ChatPage: Updated currentConversationId:",
      conversationId || null
    );
  }, [conversationId]);

  useEffect(() => {
    localStorage.setItem("aiMode", JSON.stringify(aiMode));
  }, [aiMode]);

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
          setMessages(conversation.messages || []);
          console.log("ChatPage: Conversation fetched:", conversation);
          const lastBotMessage = conversation.messages
            ?.slice()
            .reverse()
            .find((msg) => msg.sender === "bot");
          if (lastBotMessage) {
            setResponseHistory([lastBotMessage]);
            setCurrentResponseIndex(0);
          }
          console.log("ChatPage: Conversation fetched:", conversation);
        })

        .catch((error) => {
          console.error("Error fetching conversation:", error);
          setError(error.message || "Failed to load conversation");
          setMessages([]);
        });
    } else {
      setConversationMetadata(null);
      setMessages([]);
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
      setMessages([]);
    }
    return () => unsubscribe();
  }, [user, conversationId]);

  useEffect(() => {
    if (user) {
      getConversations()
        .then((result) => {
          setConversations(result.data.conversations);
        })
        .catch((error) => {
          console.error("Error fetching conversations:", error);
          setConversations([]);
        });
    } else {
      setConversations([]);
      console.log("ChatPage: No user, clearing conversations");
    }
  }, [user]);

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

  const handleRegenerate = async () => {
    if (isSending) return;
    setLoading(true);

    const lastBotMessageIndex = messages
      .slice()
      .reverse()
      .findIndex((msg) => msg.sender === "bot");
    if (lastBotMessageIndex === -1) {
      setLoading(false);
      return;
    }

    const lastBotPosition = messages.length - 1 - lastBotMessageIndex;
    if (
      lastBotPosition === 0 ||
      messages[lastBotPosition - 1].sender !== "user"
    ) {
      setLoading(false);
      return;
    }

    const lastUserMessage = messages[lastBotPosition - 1];
    setIsSending(true);

    try {
      await sendGeminiMessage(
        lastUserMessage.text || "",
        setInput,
        messages,
        setMessages,
        setLoading,
        aiMode,
        currentConversationId,
        setCurrentConversationId,
        true, // isRegenerate
        setResponseHistory,
        []
      );
      setCurrentResponseIndex((prev) => responseHistory.length); // Move to the latest response
    } catch (error) {
      setError(`Failed to regenerate response: ${error.message}`);
    } finally {
      setIsSending(false);
      setLoading(false);
    }
  };

  const handleStartConversation = (firstInput) => {
    if (firstInput.trim()) {
      handleSend(firstInput);
    }
  };

  const handleDrawerToggle = () => {
    setNavOpen(!navOpen);
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
        {(!isMobile || navOpen) && user && (
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
        <AppHeader
          handleDrawerToggle={handleDrawerToggle}
          aiMode={aiMode}
          setAiMode={setAiMode}
        />
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
                responseHistory={responseHistory}
                currentResponseIndex={currentResponseIndex}
                setCurrentResponseIndex={setCurrentResponseIndex}
                loading={loading}
                error={error}
                setError={setError}
                onRegenerate={handleRegenerate}
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
                setInput={setInput}
                onChange={(e) => setInput(e.target.value)}
                onEnter={handleSend}
                onFileUpload={handleFileUpload}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
