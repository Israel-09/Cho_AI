import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  styled,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import {
  ContentCopy,
  Refresh,
  VolumeUp,
  VolumeOff,
  ArrowBackIos as ArrowBack,
  ArrowForwardIos as ArrowForward,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ArticleIcon from "@mui/icons-material/Article";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

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

const Conversation = ({
  messages,
  setMessages,
  responseHistory,
  currentResponseIndex,
  setCurrentResponseIndex,
  loading,
  error,
  setError,
  onRegenerate,
}) => {
  const messagesEndRef = useRef(null);
  const [animatedMessages, setAnimatedMessages] = useState([]);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [preferredVoice, setPreferredVoice] = useState("");
  const { user } = useAuth();

  // State for modal management
  const [selectedFileForModal, setSelectedFileForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CodeBlock = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[900],
    borderRadius: "8px",
    padding: theme.spacing(1),
    margin: theme.spacing(2, 0),
    overflow: "hidden",
    width: "100%",
    maxHeight: "80vh",
    whiteSpace: "pre",
  }));

  const InlineCode = styled("code")(({ theme }) => ({
    fontWeight: "bold",
    backgroundColor: "#282A2C",
    color: "#bcbcbc",
    borderRadius: 5,
    padding: "2px 4px",
    whiteSpace: "normal",
    wordBreak: "break-word",
  }));

  const Table = styled("table")(({ theme }) => ({
    borderCollapse: "collapse",
    width: "100%",
    margin: theme.spacing(2, 0),
    borderRadius: "13px",
    "& th, & td": {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      textAlign: "left",
    },
    "& th": {
      backgroundColor: theme.palette.grey[600],
      fontWeight: "bold",
      color: "black",
    },
  }));

  const Image = styled("img")(({ theme }) => ({
    maxWidth: "100%",
    height: "auto",
    borderRadius: "theme.shape.borderRadius",
    margin: theme.spacing(1, 0),
  }));

  const Math = styled("span")(({ theme }) => ({
    "& .katex": {
      fontSize: "1rem",
      lineHeight: "1.5",
    },
  }));

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
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackBarMessage("Text copied to clipboard");
        setSnackBarOpen(true);
        console.log("Text copied to clipboard:", text);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
        setError("Failed to copy text");
      });
  };

  // Fetch user preferences from Firestore
  useEffect(() => {
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

  useEffect(() => {
    // Create a new messages array with the current bot response replaced
    const lastBotMessageIndex = messages
      .slice()
      .reverse()
      .findIndex((msg) => msg.sender === "bot");
    const lastBotPosition =
      lastBotMessageIndex !== -1
        ? messages.length - 1 - lastBotMessageIndex
        : -1;

    let updatedMessages = [...messages];
    if (responseHistory.length > 0 && lastBotPosition !== -1) {
      // Replace the last bot message with the current response from history
      updatedMessages = [
        ...messages.slice(0, lastBotPosition),
        {
          ...messages[lastBotPosition],
          text: responseHistory[currentResponseIndex].text,
          displayText: responseHistory[currentResponseIndex].text,
          files: responseHistory[currentResponseIndex].files || [],
        },
        ...messages.slice(lastBotPosition + 1),
      ];
    }

    // Set animatedMessages with full text immediately for all messages
    setAnimatedMessages(
      updatedMessages.map((msg) => ({
        ...msg,
        displayText: msg.text, // Always show full text immediately
      }))
    );
  }, [messages, responseHistory, currentResponseIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [animatedMessages]);

  const lastBotMessageIndex = messages
    .slice()
    .reverse()
    .findIndex((msg) => msg.sender === "bot");

  const lastBotMessagePosition =
    lastBotMessageIndex !== -1 ? messages.length - 1 - lastBotMessageIndex : -1;

  const handlePrevious = () => {
    if (currentResponseIndex > 0) {
      setCurrentResponseIndex(currentResponseIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentResponseIndex < responseHistory.length - 1) {
      setCurrentResponseIndex(currentResponseIndex + 1);
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

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "68vh",
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          flex: 1,
          overflowX: "hidden",
          padding: 2,
          ":hover": {
            overflowY: "auto",
          },
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
        <List sx={{ padding: 0 }}>
          {animatedMessages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender === "user" ? "flex-end" : "flex-start",
                padding: "8px 0",
                width: "100%",
              }}
            >
              <ListItemText
                primary={
                  message.sender === "bot" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          if (!inline && match) {
                            return (
                              <CodeBlock>
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  wrapLines={false}
                                  wrapLongLines={false}
                                  customStyle={{
                                    margin: 0,
                                    padding: 0,
                                    background: "none",
                                    whiteSpace: "pre",
                                    overflowX: "auto",
                                    overflowY: "auto",
                                  }}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </CodeBlock>
                            );
                          }
                          return <InlineCode {...props}>{children}</InlineCode>;
                        },
                        table({ node, children, ...props }) {
                          return <Table {...props}>{children}</Table>;
                        },
                        img({ node, ...props }) {
                          return <Image {...props} />;
                        },
                        math({ node, inline, children, ...props }) {
                          return <Math {...props}>{children}</Math>;
                        },
                        inlineMath({ node, children, ...props }) {
                          return <Math {...props}>{children}</Math>;
                        },
                        a({ node, children, ...props }) {
                          return (
                            <Link target="_blank" {...props}>
                              {children}
                            </Link>
                          );
                        },
                      }}
                    >
                      {message.displayText}
                    </ReactMarkdown>
                  ) : message.files ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                          width: "100%",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        {message.files.map((file, fileIndex) => {
                          return (
                            <Box
                              key={fileIndex}
                              sx={{
                                height: "70px",
                                width: "200px",
                                background: "#282A2C",
                                borderRadius: "8px",
                                padding: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#3a3b3c",
                                },
                              }}
                              onClick={() => openFileModal(file)}
                            >
                              <Box>
                                <ArticleIcon sx={{ fontSize: "1.5rem" }} />
                              </Box>
                              <Box
                                width={"80%"}
                                sx={{ marginLeft: "5px", padding: 0 }}
                              >
                                <Typography
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  {file.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.7rem",
                                    color: "#aaa",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  {file.type.split("/")[1]}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: "#333",
                          padding: "8px",
                          borderRadius: "8px 0px 8px 8px",
                          width: "fit-content",
                          float: "right",
                        }}
                      >
                        <Typography sx={{}}>{message.text}</Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.9rem",
                      }}
                    >
                      {message.text}
                    </Typography>
                  )
                }
                sx={{
                  borderRadius: "8px",
                  padding: message.sender === "user" ? "8px 12px" : "2px 4px",
                  maxWidth: "fit-content",
                  fontSize: "0.9rem",
                  color: "#efefef",
                  display: "flex",
                  gap: "8px",
                }}
              />
              {message.sender === "bot" && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 0,
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    title="Copy"
                    onClick={() => handleCopy(message.text)}
                    sx={{
                      color: "#fff",
                      fontSize: "1.1rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                  {index === lastBotMessagePosition && (
                    <>
                      <IconButton
                        title="Regenerate Response"
                        onClick={() => onRegenerate()}
                        sx={{
                          color: "#fff",
                          fontSize: "1.1rem",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        <Refresh />
                      </IconButton>
                      {responseHistory.length > 1 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={handlePrevious}
                            disabled={currentResponseIndex === 0}
                            sx={{
                              color:
                                currentResponseIndex === 0 ? "#555" : "#fff",
                              fontSize: "1.1rem",
                              "&:hover": {
                                backgroundColor:
                                  currentResponseIndex === 0
                                    ? "transparent"
                                    : "rgba(255, 255, 245, 0.1)",
                              },
                            }}
                          >
                            <ArrowBack />
                          </IconButton>
                          <Typography
                            sx={{ color: "#fff", fontSize: "0.9rem" }}
                          >
                            {currentResponseIndex + 1}/{responseHistory.length}
                          </Typography>
                          <IconButton
                            onClick={handleNext}
                            disabled={
                              currentResponseIndex ===
                              responseHistory.length - 1
                            }
                            sx={{
                              color:
                                currentResponseIndex ===
                                responseHistory.length - 1
                                  ? "#555"
                                  : "#fff",
                              fontSize: "1.1rem",
                              "&:hover": {
                                backgroundColor:
                                  currentResponseIndex ===
                                  responseHistory.length - 1
                                    ? "transparent"
                                    : "rgba(255, 255, 255, 0.1)",
                              },
                            }}
                          >
                            <ArrowForward />
                          </IconButton>
                        </Box>
                      )}
                    </>
                  )}
                  <IconButton
                    title={
                      speakingMessageId === index
                        ? "Stop Reading"
                        : "Read Aloud"
                    }
                    onClick={() => toggleReadAloud(index, message.text)}
                    sx={{
                      color: "#fff",
                      fontSize: "1.1rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    {speakingMessageId === index ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Box>
              )}
            </ListItem>
          ))}
          {loading && (
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                padding: "8px 0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  maxWidth: "fit-content",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                  aria-label="Loading response"
                >
                  <Box
                    sx={{
                      width: "4px",
                      height: "4px",
                      backgroundColor: "#888",
                      borderRadius: "50%",
                      animation: "pulse 1.2s ease-in-out infinite",
                      animationDelay: "0s",
                    }}
                  />
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#888",
                      borderRadius: "50%",
                      animation: "pulse 1.2s ease-in-out infinite",
                      animationDelay: "0.3s",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#888",
                      borderRadius: "50%",
                      animation: "pulse 1.2s ease-in-out infinite",
                      animationDelay: "0.5s",
                    }}
                  />
                </Box>
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <Snackbar
        open={!!error}
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
    </Container>
  );
};

const styles = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Conversation;
