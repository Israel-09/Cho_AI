import React, { useEffect, useRef, useState } from "react";
import {
  Grid2,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import {
  AttachFile,
  Mic,
  MicOff,
  Send,
  Send as SendIcon,
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
  const fileInputRef = useRef(null);

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
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file); // Pass the file to ChatPage.jsx
      event.target.value = null; // Reset file input
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (isLargeScreen && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline in TextField
      onEnter(value); // Trigger submission
      setIsRecording(false); // Stop recording if Enter is pressed
      if (recognition) {
        recognition.stop();
      }
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
                      <Send onClick={() => onEnter(value)} title="Send" />
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
