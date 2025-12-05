import { Box, useMediaQuery, useTheme, Container } from "@mui/material";
import React from "react";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Typography, Link } from "@mui/material";
import RenderGeneratedImages from "./RenderGeneratedImages";

const RenderBotResponse = ({ message }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth="100%"
      sx={{
        padding: isMobile ? "5px 10px 0 0" : "16px 20px 0  0",
        borderRadius: "12px 12px 12px 4px", // subtle tail on the left

        boxShadow: "0 1px 2px rgba(41, 36, 36, 0.3)",
        overflow: "hidden",
      }}
    >
      {message.status === "error" ? (
        <>
          <Box
            sx={{
              color: "red",
              fontWeight: "bold",
              mb: 1,
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body1">
              Your request could not be processed. Please try again.
            </Typography>
          </Box>
        </>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Headings
            h1: ({ children }) => (
              <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                {children}
              </Typography>
            ),
            h2: ({ children }) => (
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  letterSpacing: "1px",
                  fontFamily: "Montserrat, sans-serif",
                  color: "#ffffffff",
                }}
              >
                {children}
              </Typography>
            ),
            h3: ({ children }) => (
              <Typography
                variant="subtitle1"
                sx={{
                  mt: 2.5,
                  mb: 1,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: "1px",
                  fontFamily: "Montserrat, sans-serif",
                  color: "#ffffffff",
                }}
              >
                {children}
              </Typography>
            ),

            // Paragraphs
            p: ({ children }) => (
              <Typography
                variant="body1"
                sx={{
                  my: 2,
                  lineHeight: 1.7,
                  color: "#f6f6f6",
                  fontWeight: 200,
                }}
              >
                {children}
              </Typography>
            ),

            // Lists
            ul: ({ children }) => (
              <Box
                component="ul"
                sx={{ my: 2, pl: 4, color: "#f6f6f6", fontWeight: 200 }}
              >
                {children}
              </Box>
            ),
            ol: ({ children }) => (
              <Box component="ol" sx={{ my: 2, pl: 4, color: "#f6f6f6" }}>
                {children}
              </Box>
            ),
            li: ({ children }) => (
              <Typography
                component="li"
                sx={{
                  mb: 1,
                  lineHeight: 1.6,
                  fontWeight: 200,
                }}
              >
                {children}
              </Typography>
            ),

            // Blockquote
            blockquote: ({ children }) => (
              <Box
                sx={{
                  borderLeft: "4px solid #58a6ff",
                  pl: 2,
                  py: 1,
                  my: 3,
                  backgroundColor: "rgba(88, 166, 255, 0.1)",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <Typography sx={{ color: "#bbdefb", fontStyle: "italic" }}>
                  {children}
                </Typography>
              </Box>
            ),

            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              if (!inline && match) {
                return (
                  <Box
                    sx={{
                      my: 3,
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #30363d",
                      backgroundColor: "#0d1117",
                      lineHeight: 1.5,
                      maxWidth: "767px",
                    }}
                  >
                    {/* Optional: Language label bar */}
                    <Box
                      sx={{
                        backgroundColor: "#161b22",
                        px: 3,
                        py: 1.5,
                        color: "#8b949e",
                        borderBottom: "1px solid #30363d",
                        fontFamily:
                          "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                      }}
                    >
                      {match[1].toUpperCase()}
                    </Box>

                    {/* Scrollable code container */}
                    <Box
                      sx={{
                        overflowX: "auto",
                        overflowY: "hidden",
                        // Enable smooth scrolling on desktop
                        "&::-webkit-scrollbar": {
                          height: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#161b22",
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#30363d",
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          background: "#58a6ff",
                        },
                      }}
                    >
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers={false}
                        wrapLongLines={false} // Important: don't wrap, let it scroll
                        customStyle={{
                          margin: 0,
                          padding: "16px 20px",
                          background: "transparent",
                          minWidth: "fit-content", // Allows horizontal scroll for long lines
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </Box>
                  </Box>
                );
              }

              // Inline code
              return (
                <Box
                  component="code"
                  sx={{
                    backgroundColor: "rgba(110, 118, 129, 0.4)",
                    color: "#ffab70",
                    px: 0.5,
                    py: 0.2,
                    borderRadius: "4px",
                    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                  }}
                  {...props}
                >
                  {children}
                </Box>
              );
            },

            // Tables
            table: ({ children }) => (
              <Box sx={{ my: 3, overflowX: "auto" }}>
                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #444",
                  }}
                >
                  {children}
                </Box>
              </Box>
            ),
            th: ({ children }) => (
              <Box
                component="th"
                sx={{
                  borderBottom: "1px solid #58a6ff",
                  bg: "#161b22",
                  py: 1.5,
                  px: 2,
                  textAlign: "left",
                }}
              >
                <Typography fontWeight={600} color="#58a6ff">
                  {children}
                </Typography>
              </Box>
            ),
            td: ({ children }) => (
              <Box
                component="td"
                sx={{
                  borderBottom: "1px solid #333",
                  py: 1.5,
                  px: 2,
                  color: "#f6f6f6",
                }}
              >
                {children}
              </Box>
            ),

            // Links
            a: ({ children, href }) => (
              <>
                <Link href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </Link>

                {/* show page preview or favicon on hover */}
                {/* <Box></Box> */}
              </>
            ),

            // Images
            img: ({ src, alt }) => (
              <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  my: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              />
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      )}{" "}
    </Container>
  );
};

export default RenderBotResponse;
