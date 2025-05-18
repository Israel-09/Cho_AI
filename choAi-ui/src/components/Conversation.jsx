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
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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

  const CodeBlock = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[900],
    borderRadius: "13px",
    padding: theme.spacing(1),
    margin: theme.spacing(2, 0),
    overflowX: "auto",
    overflowY: "auto",
    maxWidth: "100%",
    maxHeight: "300px",
    whiteSpace: "pre",
    "&::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#555",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#aaa",
    },
  }));

  const InlineCode = styled("code")(({ theme }) => ({
    fontWeight: "bold",
    backgroundColor: theme.palette.grey[800],
    borderRadius: 2,
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
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(1, 0),
  }));

  const Math = styled("span")(({ theme }) => ({
    "& .katex": {
      fontSize: "1rem",
      lineHeight: "1.5",
    },
  }));

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

  const toggleReadAloud = (messageId, text) => {
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-NG";
      utterance.pitch = 0.6;
      utterance.onend = () => {
        setSpeakingMessageId(null);
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error("SpeechSynthesis error:", event.error);
        setError("Failed to read aloud");
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
          isNew: false, // Avoid re-animating
        },
        ...messages.slice(lastBotPosition + 1),
      ];
    }

    setAnimatedMessages(
      updatedMessages.map((newMsg) => ({
        ...newMsg,
        displayText: newMsg.sender === "bot" && newMsg.isNew ? "" : newMsg.text,
        isAnimated: newMsg.sender !== "bot" || !newMsg.isNew,
        isNew: newMsg.isNew || false,
      }))
    );
  }, [messages, responseHistory, currentResponseIndex]);

  useEffect(() => {
    const botMessages = animatedMessages.filter(
      (msg) => msg.sender === "bot" && !msg.isAnimated && msg.isNew
    );

    if (botMessages.length === 0) return;

    const intervalMs = 50;
    const charsPerStep = 10;

    const intervals = botMessages.map((botMessage) => {
      const fullText = botMessage.text;
      const interval = setInterval(() => {
        setAnimatedMessages((prev) =>
          prev.map((msg) => {
            if (msg === botMessage) {
              const currentLength = msg.displayText.length;
              if (currentLength < fullText.length) {
                return {
                  ...msg,
                  displayText: fullText.slice(0, currentLength + charsPerStep),
                };
              }
              return { ...msg, displayText: fullText, isAnimated: true };
            }
            return msg;
          })
        );
      }, intervalMs);

      return interval;
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [animatedMessages]);

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

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "90%",
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
                      }}
                    >
                      {message.displayText}
                    </ReactMarkdown>
                  ) : message.fileUrl ? (
                    <>
                      {message.fileUrl.includes("image") ? (
                        <Image src={message.fileUrl} alt={message.fileName} />
                      ) : (
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#6B5B95" }}
                        >
                          {message.fileName || "View File"}
                        </a>
                      )}
                      {message.text && <Box sx={{ mt: 1 }}>{message.text}</Box>}
                    </>
                  ) : (
                    message.displayText
                  )
                }
                sx={{
                  background:
                    message.sender === "user" ? "rgb(61, 61, 61)" : "",
                  borderRadius: "8px",
                  padding: message.sender === "user" ? "8px 12px" : "2px 4px",
                  maxWidth: "fit-content",
                  wordWrap: "break-word",
                  fontSize: "14px",
                  color: "#fff",
                }}
              />
              {message.sender === "bot" && (
                <Box
                  sx={{ display: "flex", gap: 1, mt: 0, alignItems: "center" }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                                    : "rgba(255, 255, 255, 0.1)",
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
