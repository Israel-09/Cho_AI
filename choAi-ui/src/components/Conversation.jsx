import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";

const Conversation = ({ messages, setMessages, loading, error, setError }) => {
  const messagesEndRef = useRef(null);
  const [animatedMessages, setAnimatedMessages] = useState([]);

  // Update animatedMessages when messages change
  useEffect(() => {
    setAnimatedMessages((prevAnimated) => {
      return messages.map((newMsg) => {
        const existingMsg = prevAnimated.find(
          (msg) => msg.text === newMsg.text && msg.sender === newMsg.sender
        );
        if (existingMsg) {
          return existingMsg; // Preserve animation state
        }
        // For new messages: animate only new bot messages; display others fully
        return {
          ...newMsg,
          displayText:
            newMsg.sender === "bot" && newMsg.isNew ? "" : newMsg.text,
          isAnimated: newMsg.sender !== "bot" || !newMsg.isNew,
          isNew: newMsg.isNew || false, // Preserve isNew flag
        };
      });
    });
  }, [messages]);

  // Animate new, un-animated bot messages
  useEffect(() => {
    const botMessages = animatedMessages.filter(
      (msg) => msg.sender === "bot" && !msg.isAnimated && msg.isNew
    );

    if (botMessages.length === 0) return;

    const totalDuration = 3000; // 3 seconds per message
    const intervalMs = 50; // Update every 50ms
    const totalSteps = Math.ceil(totalDuration / intervalMs);

    const intervals = botMessages.map((botMessage) => {
      const fullText = botMessage.text;
      const charsPerStep = Math.max(1, Math.ceil(fullText.length / totalSteps));

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

  // Scroll to the bottom when messages or animated text update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, animatedMessages]);

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
          flex: 1,
          overflowY: "hidden",
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
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                padding: "8px 0",
              }}
            >
              <ListItemText
                primary={
                  message.sender === "bot" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return inline ? (
                            <code
                              className={className}
                              style={{
                                background: "#211",
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <Box
                              component="pre"
                              sx={{
                                padding: "8px",
                                borderRadius: "4px",
                                overflowX: "auto",
                                width: "100%",
                                backgroundColor: "#282c34",
                                border: "1px solid #444",

                                "&::-webkit-scrollbar": {
                                  height: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                  background: "#e0e0e0",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  background: "#343434",
                                  borderRadius: "2px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                  background: "#555",
                                },
                              }}
                            >
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </Box>
                          );
                        },
                      }}
                    >
                      {message.displayText}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )
                }
                sx={{
                  background:
                    message.sender === "user" ? "rgb(61, 61, 61)" : "",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  maxWidth: "fit-content",
                  wordWrap: "break-word",
                  fontSize: "14px",
                }}
              />
            </ListItem>
          ))}
          {/* Custom Loading Indicator for Bot Response */}
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
    </Container>
  );
};

// Add CSS keyframes for the pulsing dots animation
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
