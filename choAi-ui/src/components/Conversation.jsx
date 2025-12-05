import React, { useEffect, useRef, useState, memo } from "react";
import {
  Alert,
  Box,
  Container,
  Snackbar,
  styled,
  IconButton,
  Typography,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  ContentCopyRounded as ContentCopy,
  RefreshRounded as Refresh,
  VolumeUpRounded as VolumeUp,
  VolumeOffRounded as VolumeOff,
  ArrowBackIosRounded as ArrowBack,
  ArrowForwardIosRounded as ArrowForward,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import RenderBotResponse from "./RenderBotResponse";
import RenderGeneratedImages from "./RenderGeneratedImages";
import useChatStore from "../hooks/chatState";
import { Riple } from "react-loading-indicators";

// Styled component for links
const Link = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "underline",
  "&:hover": {
    textDecoration: "none",
    color: theme.palette.primary.dark,
  },
  target: "_blank",
  rel: "noopener noreferrer",
}));

const Conversation = ({ error, setError, onRegenerate }) => {
  const loadingMessages = useChatStore((state) => state.loadingMessages);
  const loading = useChatStore((state) => state.loading);
  const messages = useChatStore((state) => state.messages);
  const isSending = useChatStore((state) => state.isSending);
  const botTyping = useChatStore((state) => state.botTyping);

  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [preferredVoice, setPreferredVoice] = useState("");
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useTheme().breakpoints.down("md");

  // State for modal management
  const [selectedFileForModal, setSelectedFileForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [botTyping]);

  // Load available voices for "Read Aloud"
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleCopy = (text) => {
    console.log("Copying text to clipboard:", messages);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackBarMessage("Text copied to clipboard");
        setSnackBarOpen(true);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
        setError("Failed to copy text");
      });
  };

  // Fetch user preferences from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPreferredVoice(data.preferredVoice || "");
        console.log("AccountSettings: User data fetched");
      }
    };

    fetchUserData();
  }, [user]);

  const toggleReadAloud = (messageId, text) => {
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === preferredVoice);
      console.log("Using preferred voice:", preferredVoice);
      if (voice) {
        utterance.voice = voice;
        console.log("Using preferred voice:", voices);
      }
      utterance.lang = "en-NG";
      utterance.pitch = 0.6;
      utterance.onend = () => {
        setSpeakingMessageId(null);
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error("SpeechSynthesis error:", event.error);
        // setError("Failed to read aloud");
      };
      utterance.onstart = () => {
        setSpeakingMessageId(messageId);
        setIsSpeaking(true);
      };
      utterance.onpause = () => {
        setSpeakingMessageId(null);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to open the modal with the selected file
  const openFileModal = (file) => {
    setSelectedFileForModal(file);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeFileModal = () => {
    setSelectedFileForModal(null);
    setIsModalOpen(false);
  };

  const containerRef = useRef(null);
  const [activeVersion, setActiveVersion] = useState({}); // { userMsgId: versionIndex }

  // Group messages by user turn
  const groups = [];
  let currentGroup = null;

  if (Array.isArray(messages)) {
    messages.forEach((msg) => {
      if (msg.sender === "user") {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { user: msg, bots: [] };
      } else if (msg.sender === "bot" && currentGroup) {
        currentGroup.bots.push(msg);
      }
    });
  }

  if (currentGroup) groups.push(currentGroup);

  // Auto-select latest version for each group
  useEffect(() => {
    const newActive = {};
    groups.forEach((group) => {
      if (group.bots.length > 0) {
        const userId = group.user.id;
        const latestIndex = group.bots.length - 1;
        if (!(userId in activeVersion) || activeVersion[userId] === undefined) {
          newActive[userId] = latestIndex;
        } else {
          newActive[userId] = Math.min(activeVersion[userId] || 0, latestIndex);
        }
      }
    });
    setActiveVersion(newActive);
  }, [messages]);

  useEffect(() => {
    const newActive = {};

    groups.forEach((group) => {
      if (group.user?.id && group.bots.length > 0) {
        newActive[group.user.id] = group.bots.length - 1; // always latest
      }
    });

    setActiveVersion(newActive);
  }, [messages.length]);

  const scrollToBotMessage = (botId) => {
    const el = document.getElementById(`bot-${botId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handlePrev = (userId) => {
    setActiveVersion((prev) => ({
      ...prev,
      [userId]: Math.max(0, (prev[userId] || 0) - 1),
    }));
  };

  const handleNext = (userId, total) => {
    setActiveVersion((prev) => ({
      ...prev,
      [userId]: Math.min(total - 1, (prev[userId] || 0) + 1),
    }));
  };

  if (loadingMessages) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
          height: "100%",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        overflow: "hidden",
        width: "100%",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        overflowY: "auto",

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
      <Container
        maxWidth="md"
        sx={{
          width: "100%",
          flex: 1,
          padding: 2,
        }}
      >
        {groups.map((group, groupIndex) => {
          const userId = group.user?.id;
          const bots = group.bots;
          const isLastGroup = groupIndex === groups.length - 1;
          const activeIndex = userId
            ? activeVersion[userId] ?? bots.length - 1
            : bots.length - 1;
          const activeBot = bots[activeIndex];
          const hasMultiple = bots.length > 1;

          const showBotActions =
            activeBot?.status === "completed" || !isLastGroup;

          return (
            <Box key={groupIndex} sx={{ mb: 4 }}>
              {group.user && (
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    overflow: "hidden",
                  }}
                >
                  {group.user.files.map((file, fileIndex) => (
                    <Box
                      key={fileIndex}
                      onClick={() => openFileModal(file)}
                      sx={{
                        float: "right",
                        height: "70px",
                        width: "200px",
                        background: "#2d3748",
                        borderRadius: "8px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": { backgroundColor: "#4a5568" },
                      }}
                    >
                      <ArticleIcon sx={{ fontSize: "1.5rem", mr: 1 }} />
                      <Box>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: "140px" }}
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="gray">
                          {file.type.split("/").pop()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      backgroundColor: "#2a2a2a",
                      padding: "12px 16px",
                      borderRadius: "12px 4px 12px 12px",
                      maxWidth: "80%",
                      ml: "auto",
                      color: "#e2e8f0",
                      fontWeight: 400,
                    }}
                  >
                    <Typography variant="body1">{group.user.text}</Typography>
                  </Box>
                </Box>
              )}
              {botTyping && isLastGroup && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Riple
                    speedPlus="-2"
                    color="#fff"
                    size="small"
                    text=""
                    textColor=""
                  />
                </Box>
              )}
              {activeBot ? (
                <Box>
                  <RenderBotResponse message={activeBot} />
                  {activeBot.generatedImages && (
                    <RenderGeneratedImages
                      images={activeBot.generatedImages}
                      status={activeBot.status}
                    />
                  )}

                  {/* === ACTION BUTTONS - Only show when response is complete === */}
                  {showBotActions && (
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        paddingLeft: "16px",
                      }}
                    >
                      {/* Copy - always available */}
                      <IconButton
                        sx={{ fontSize: isMobile ? "26px" : "32px" }}
                        onClick={() => handleCopy(activeBot.text || "")}
                        title="Copy"
                      >
                        <ContentCopy />
                      </IconButton>

                      {/* Speak - always available */}
                      <IconButton
                        size="small"
                        sx={{ fontSize: isMobile ? "26px" : "32px" }}
                        onClick={() =>
                          toggleReadAloud(activeBot.id, activeBot.text || "")
                        }
                        title={
                          speakingMessageId === activeBot.id
                            ? "Stop"
                            : "Read aloud"
                        }
                      >
                        {speakingMessageId === activeBot.id ? (
                          <VolumeOff />
                        ) : (
                          <VolumeUp />
                        )}
                      </IconButton>

                      {/* Regenerate - ONLY on the very latest response */}
                      {isLastGroup && activeIndex === bots.length - 1 && (
                        <IconButton
                          sx={{ fontSize: isMobile ? "26px" : "32px" }}
                          onClick={() => onRegenerate(activeBot.id)}
                          title="Regenerate"
                        >
                          <Refresh />
                        </IconButton>
                      )}

                      {/* Version Navigation - only if multiple versions exist */}
                      {hasMultiple && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handlePrev(userId)}
                            disabled={activeIndex === 0}
                          >
                            <ArrowBackIos fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="caption"
                            sx={{ minWidth: 50, textAlign: "center" }}
                          >
                            {activeIndex + 1} / {bots.length}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleNext(userId, bots.length)}
                            disabled={activeIndex === bots.length - 1}
                          >
                            <ArrowForwardIos fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ) : isSending && isLastGroup ? (
                // Show typing indicator when no activeBot yet but typing
                <Box sx={{ my: 3 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#faa86f",
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#faa86f",
                        animation: "pulse 1.5s 0.2s infinite",
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#faa86f",
                        animation: "pulse 1.5s 0.4s infinite",
                      }}
                    />
                  </Box>
                </Box>
              ) : null}
            </Box>
          );
        })}
      </Container>
      <Snackbar
        open={error}
        onClose={() => setError(null)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar
        open={snackBarOpen}
        onClose={() => setSnackBarOpen(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{snackBarMessage}</Alert>
      </Snackbar>
      {console.log("Rendering Conversation component")}
    </Box>
  );
};

export default memo(Conversation);
