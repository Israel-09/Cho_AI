import React, { useEffect, useRef, useState } from "react";
import {
  Grid2,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  AttachFile,
  Mic,
  MicOff,
  Send,
  Send as SendIcon,
  Close,
} from "@mui/icons-material";

// Cross-browser SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const InputSection = ({ value, setInput, onChange, onEnter, onFileUpload }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
  ];

  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true; // Fixed typo
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

    // Cleanup on unmount
    return () => {
      if (isRecording) {
        speechRecognition.stop();
      }
    };
  }, []); // Added dependency

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
  const handleFileChange = (event) => {
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
      const isValidSize = file.size <= MAX_FILE_SIZE;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push({
          name: file.name,
          reason: !isValidType
            ? "Invalid file type (only images and documents allowed)"
            : "File size exceeds 2MB",
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
      onFileUpload(validFiles); // Pass valid files to parent
    }

    event.target.value = null; // Reset file input
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (isLargeScreen && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      onEnter(value, selectedFiles); // Pass files along with the message
      setIsRecording(false);
      if (recognition) {
        recognition.stop();
      }
      setSelectedFiles([]); // Clear files after sending
    }
  };

  // Handle Send button click
  const handleSend = () => {
    if (value || selectedFiles.length > 0) {
      console.log("Selected files:", selectedFiles);
      onEnter(value, selectedFiles);

      setSelectedFiles([]); // Clear files after sending
    }
  };

  return (
    <Grid2
      container
      gap={1}
      marginTop={2}
      sx={{ width: "95%", alignItems: "center", flexWrap: "nowrap" }}
    >
      <Grid2 size={12}>
        {/* Display selected files as chips */}
        {selectedFiles.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
              maxHeight: "100px",
              overflowY: "auto",
            }}
          >
            {selectedFiles.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                onDelete={() => handleRemoveFile(index)}
                deleteIcon={<Close />}
                sx={{
                  backgroundColor: theme.palette.grey[700],
                  color: "#fff",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                  },
                }}
              />
            ))}
          </Box>
        )}

        <TextField
          multiline
          placeholder={
            isSupported
              ? "AskCho anything"
              : "Voice input not supported in this browser"
          }
          variant="outlined"
          onChange={onChange}
          onKeyDown={handleKeyDown}
          maxRows={6}
          name="input"
          value={value}
          fullWidth
          aria-label="Chat input"
          sx={{
            overflowY: "hidden",
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "#fff" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": { borderColor: "#fff" },
            },
            "& .MuiInputBase-input": { color: "#fff" },
            "& .MuiInputLabel-root": { color: "#fff" },
          }}
          InputProps={{
            // startAdornment: (
            //   <IconButton
            //     title="Attach files"
            //     onClick={() => fileInputRef.current.click()}
            //     sx={{ color: "#fff" }}
            //   >
            //     <AttachFile />
            //   </IconButton>
            // ),
            endAdornment: (
              <>
                <input
                  type="file"
                  accept="image/*,application/pdf,.txt"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
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
                      <Send onClick={handleSend} title="Send" />
                    ) : (
                      <Mic onClick={toggleRecording} title="Use voice input" />
                    )}
                  </IconButton>
                )}
              </>
            ),
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default InputSection;
