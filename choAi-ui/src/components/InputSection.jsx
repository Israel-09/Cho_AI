import React, { useEffect, useRef, useState } from "react";
import {
  Grid2,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  Button,
} from "@mui/material";
import {
  AttachFile,
  Mic,
  Send,
  ChevronLeft,
  ChevronRight,
  Close,
  Search,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import SigninRequiredDialog from "./SigninRequiredDialog";

// Cross-browser SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const InputSection = ({
  value,
  setInput,
  onChange,
  onEnter,
  onFileUpload,
  searchSelected,
  setSearchSelected,
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [openSigninDialog, setOpenSigninDialog] = useState(false);
  const [feature, setFeature] = useState("");

  const fileInputRef = useRef(null);
  const fileContainerRef = useRef(null);
  const { user, userData } = useAuth();

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
  ];
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    speechRecognition.onerror = (event) => {
      console.log("Speech recognition error:", event);
      setIsRecording(false);
      setInput((prev) => prev || "Error recognizing speech. Please try again.");
    };

    speechRecognition.onend = () => {
      setIsRecording(false);
    };

    setRecognition(speechRecognition);

    return () => {
      if (isRecording) {
        speechRecognition.stop();
      }
    };
  }, [setInput]);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setInput("");
          recognition.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.log("Microphone access error:", error);
        });
    }
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Check total number of files
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > MAX_FILES) {
      alert(`You can only upload a maximum of ${MAX_FILES} files at a time.`);
      event.target.value = null;
      return;
    }

    // Validate each file
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const isValidType = ALLOWED_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE && file.size > 0;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push({
          name: file.name,
          reason: !isValidType
            ? "Invalid file type (only images and documents allowed)"
            : "File size exceeds 5MB or is empty",
        });
      }
    });

    // Show alerts for invalid files
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles
        .map((file) => `${file.name}: ${file.reason}`)
        .join("\n");
      alert(`Some files were not added:\n${errorMessage}`);
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      const uploadedFiles = await onFileUpload(validFiles);
      setUploadFiles((prev) => [...prev, ...uploadedFiles]);
    }

    event.target.value = null; // Reset file input
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (isLargeScreen && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      console.log("Sending message:", value, uploadFiles);
      onEnter(value, uploadFiles);
      setIsRecording(false);
      if (recognition) {
        recognition.stop();
      }
      setSelectedFiles([]);
      setUploadFiles([]);
    }
  };

  // Handle Send button click
  const handleSend = () => {
    if (value || selectedFiles.length > 0) {
      console.log("Sending message:", value, uploadFiles);
      onEnter(value, uploadFiles);
      setSelectedFiles([]);
      setUploadFiles([]);
    }
  };

  // Map file types to labels
  const getFileTypeLabel = (type) => {
    const extension = type.split("/").pop().toUpperCase();
    return `[${extension}]`;
  };

  // Handle scroll navigation
  const scrollLeft = () => {
    if (fileContainerRef.current) {
      const scrollAmount = 120; // Adjust based on card width
      fileContainerRef.current.scrollLeft -= scrollAmount;
      setScrollPosition(fileContainerRef.current.scrollLeft);
    }
  };

  const scrollRight = () => {
    if (fileContainerRef.current) {
      const scrollAmount = 120; // Adjust based on card width
      fileContainerRef.current.scrollLeft += scrollAmount;
      setScrollPosition(fileContainerRef.current.scrollLeft);
    }
  };

  return (
    <Grid2
      container
      gap={1}
      marginTop={4}
      sx={{
        width: "95%",
        alignItems: "center",
        flexWrap: "nowrap",
        height: "100%",
      }}
    >
      <Grid2 size={12} sx={{ position: "relative", height: "80%" }}>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            backgroundColor: theme.palette.background.default,
            borderRadius: "13px",
            border: "1px solid #666",
            padding: 1,
            width: "100%",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 1,
            boxShadow: "0px 0px 6px rgba(130, 127, 127, 0.5)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* File display with navigation */}
          {selectedFiles.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              <IconButton
                onClick={scrollLeft}
                sx={{
                  color: "#fff",
                  visibility: scrollPosition > 0 ? "visible" : "hidden",
                }}
              >
                <ChevronLeft />
              </IconButton>
              <Box
                ref={fileContainerRef}
                sx={{
                  display: "flex",
                  gap: 1,
                  paddingTop: 2,
                  overflowX: "auto",
                  scrollbarWidth: "none", // Hide scrollbar for Firefox
                  "-ms-overflow-style": "none", // Hide scrollbar for IE and Edge
                  "&::-webkit-scrollbar": {
                    display: "none", // Hide scrollbar for Chrome, Safari, and Opera
                  },
                  flexGrow: 1,
                }}
              >
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: theme.palette.grey[800],
                      borderRadius: 1,
                      p: 1,
                      minWidth: 120,
                      color: "#fff",
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ maxWidth: "100px" }}
                    >
                      {file.name.length > 15
                        ? `${file.name.slice(0, 15)}...`
                        : file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.grey[400] }}
                    >
                      {getFileTypeLabel(file.type)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      sx={{ color: theme.palette.grey[500] }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <IconButton
                onClick={scrollRight}
                sx={{
                  color: "#fff",
                  visibility: fileContainerRef.current
                    ? fileContainerRef.current.scrollWidth >
                      fileContainerRef.current.clientWidth
                    : "hidden",
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          )}
          {/* TextField */}
          <TextField
            multiline
            placeholder={
              isSupported
                ? "Ask anything"
                : "Voice input not supported in this browser"
            }
            variant="outlined"
            onChange={onChange}
            onKeyDown={handleKeyDown}
            maxRows={6}
            name="input"
            value={value}
            aria-label="Chat input"
            sx={{
              overflowY: "hidden",
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "transparent",
                border: "none",
                "&:hover:not(.Mui-disabled):before": { border: "none" },
                "&:before": { border: "none" },
                "&:after": { border: "none" },
              },
              "& .MuiInputBase-root": {
                padding: "10px 12px",
              },
              "& fieldset": { border: "none" },
              scrollbarColor: "#555 transparent",
              scrollbarWidth: "auto",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <input
                type="file"
                accept="image/*,application/pdf,.txt"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
              />
              <IconButton
                title="Attach files"
                onClick={() => {
                  if (!user) {
                    setOpenSigninDialog(true);
                    setFeature("upload files");
                    return;
                  }
                  fileInputRef.current.click();
                }}
                sx={{ color: "#fff", fontSize: "1.4rem" }}
              >
                <AttachFile />
              </IconButton>
              <Button
                color={"primary"}
                size="small"
                variant={searchSelected ? "contained" : "outlined"}
                sx={{}}
                startIcon={<Search />}
                onClick={() => {
                  if (!user) {
                    setOpenSigninDialog(true);
                    setFeature("Research");
                    return;
                  }
                  setSearchSelected(!searchSelected);
                }}
              >
                Research
              </Button>
            </Box>
            {isSupported && (
              <IconButton
                title={value ? "Send" : "Use voice input"}
                sx={{
                  fontSize: "1.6rem",
                  color: isRecording ? "#ef0909" : "#fff",
                  animation: isRecording ? "pulse 1s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              >
                {value && !isRecording ? (
                  <Send
                    onClick={handleSend}
                    onKeyDown={handleKeyDown}
                    title="Send"
                  />
                ) : (
                  <Mic onClick={toggleRecording} title="Use voice input" />
                )}
              </IconButton>
            )}
          </Box>
        </Box>
        <SigninRequiredDialog
          openSigninDialog={openSigninDialog}
          setOpenSigninDialog={setOpenSigninDialog}
          feature={feature ? feature : "upload files"}
        />
      </Grid2>
    </Grid2>
  );
};

export default InputSection;
