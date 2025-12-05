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
  isMuiElement,
  Icon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  AttachFile,
  Mic,
  ChevronLeft,
  ChevronRight,
  Close,
  Article,
  SendRounded,
  TuneRounded,
  AutoAwesomeMosaic,
  SchoolRounded,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import SigninRequiredDialog from "./SigninRequiredDialog";
import useChatStore from "../hooks/chatState";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../config/firebase";
import { sendGeminiMessage } from "../utils/chatResponse";
import { useNavigate } from "react-router-dom";
import NewChatPrompt from "./NewChatPrompt";
import { collection, doc } from "firebase/firestore";

// Cross-browser SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const optionsMap = [
  { label: "Image Generator", icon: <AutoAwesomeMosaic />, value: "imageGen" },
  {
    label: "Research Assistant",
    icon: <SchoolRounded />,
    value: "researchAssistant",
  },
  {
    label: "Document Generator",
    icon: <Article />,
    value: "docGen",
    disabled: true,
  },
];

const InputSection = ({}) => {
  const input = useChatStore((state) => state.input);
  const setInput = useChatStore((state) => state.setInput);
  const plagiarismChecked = useChatStore((state) => state.plagiarismChecked);
  const chatOption = useChatStore((state) => state.chatOption);
  const messages = useChatStore((state) => state.messages);
  const setLoading = useChatStore((state) => state.setLoading);
  const setError = useChatStore((state) => state.setError);
  const isChatting = useChatStore((state) => state.isChatting);
  const setBotTyping = useChatStore((state) => state.setBotTyping);
  const aiMode = useChatStore((state) => state.aiMode);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const createConversation = useChatStore((state) => state.createConversation);
  const updateChatOption = useChatStore((state) => state.setChatOption);
  const [showNewConversationDialog, setShowNewConversationDialog] =
    useState(false);
  const loadingMesages = useChatStore((state) => state.loadingMessages);

  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [openSigninDialog, setOpenSigninDialog] = useState(false);
  const [feature, setFeature] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempChatOption, setTempChatOption] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const chatOptionChangeConfirm = async () => {
    setShowNewConversationDialog(false);

    updateChatOption(tempChatOption);
  };

  const handleChatOptionChange = (option) => {
    setTempChatOption(option);

    if (option !== "chat" && isChatting) {
      setShowNewConversationDialog(true);
    } else {
      updateChatOption(option);
    }
  };

  useEffect(() => {
    console.log("chat option changed: ", chatOption);
  }, [chatOption]);

  const sendRequest = async (value, files = []) => {
    if (!value.trim()) return;
    setIsSending(true);

    try {
      setLoading(true);
      let convId = currentConversationId;

      // convId should already exist (created on page load)
      if (!convId) {
        convId = await createConversation(user.uid, chatOption);
      }

      // Only update URL when sending the FIRST message
      const isFirstMessage = messages.length === 0;
      if (isFirstMessage && convId) {
        navigate(`/chat/${convId}`, { replace: true });
      }

      setInput(""); 

      await sendGeminiMessage(
        value,
        setLoading,
        aiMode,
        currentConversationId,
        false,
        files,
        chatOption,
        plagiarismChecked
      );

      if (messages.length === 0 && user) {
        navigate(`/chat/${currentConversationId}`, { replace: true });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
    setLoading(false);
    setIsSending(false);

  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const fileInputRef = useRef(null);
  const fileContainerRef = useRef(null);

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
      console.log("Sending message:", input, uploadFiles);
      sendRequest(input, uploadFiles);
      setIsRecording(false);
      if (recognition) {
        recognition.stop();
      }
      setSelectedFiles([]);
      setUploadFiles([]);
    }
  };

  const onFileUpload = async (files) => {
    if (!user) return;

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `users/${user.uid}/files/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("File uploaded:", file.name, downloadURL);
        return { name: file.name, url: downloadURL, type: file.type };
      })
    );

    return uploadedFiles;
  };

  // Handle Send button click
  const handleSend = () => {
    if (input || selectedFiles.length > 0) {
      console.log("Sending message:", input, uploadFiles);
      sendRequest(input, uploadFiles);
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

  useEffect(() => {
    setSelectedOption(
      optionsMap.find((opt) => opt.value === chatOption) || null
    );
  }, [chatOption]);

  return (
    <Grid2
      container
      gap={1}
      sx={{
        width: isMobile ? "95%" : "700px",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        bottom: 0,
        backgroundColor: "transparent",
        borderRadius: "15px",
        transition: "all 0.3s ease-in-out",
        marginBottom: isMobile ? "10px" : "20px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "transparent",
          borderRadius: "30px",
          border: "1px solid #666",
          padding: "15px 15px 0 15px",
          width: "100%",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 1,
          backdropFilter: "blur(10px)",
          boxShadow: "0px -5px 20px rgba(58, 56, 56, 0.4)",
          transition: "all 0.3s ease-in-out",
          paddingBottom: "10px",
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
                    width: 80,
                    p: "0",

                    color: "#fff",
                  }}
                >
                  <Box sx={{ width: "80%" }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontSize: "12px" }}
                    >
                      {file.name.length > 15
                        ? `${file.name.slice(0, 15)}...`
                        : file.name}
                    </Typography>
                  </Box>
                  {/* <Typography variant="body2" noWrap sx={{ fontSize: "12px" }}>
                    {file.name.length > 15
                      ? `${file.name.slice(0, 15)}...`
                      : file.name}
                  </Typography> */}
                  {/* <Typography
                    variant="caption"
                    sx={{ color: theme.palette.grey[400] }}
                  >
                    {getFileTypeLabel(file.type)}
                  </Typography> */}
                  <Article sx={{ fontSize: "28px", marginTop: 1 }} />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      color: theme.palette.grey[500],
                      "&:hover": { color: theme.palette.error.main },
                    }}
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
              ? chatOption === "imageGen"
                ? "What's on your mind?"
                : plagiarismChecked
                ? "Paste the text here for plagiarism check"
                : "AskCho anything"
              : "Voice input not supported in this browser"
          }
          variant="outlined"
          onChange={onChange}
          onKeyDown={handleKeyDown}
          maxRows={6}
          name="input"
          value={input}
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
            <Tooltip
              title={
                plagiarismChecked
                  ? "File uploads are disabled when Plagiarism Checker is enabled."
                  : "Attach files"
              }
              arrow
              placement="top"
              disableFocusListener={!plagiarismChecked} // Only disable focus listener when plagiarismChecked is true
              disableHoverListener={!plagiarismChecked} // Only disable hover listener when plagiarismChecked is true
            >
              <span>
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
                  disabled={plagiarismChecked}
                >
                  <AttachFile />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedOption && (
              <Button
                sx={{
                  color: isMobile ? "#22252aff" : "#FAA86F",
                  backgroundColor: isMobile ? "#FAA86F" : "",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: isMobile ? "#ce8351ff" : "",
                  },
                }}
                variant={isMobile ? "contained" : "text"}
                startIcon={selectedOption.icon}
                onClick={() => {
                  setSelectedOption(null);
                  handleChatOptionChange("chat");
                }}
              >
                {isMobile ? "" : selectedOption.label}
              </Button>
            )}
            <Box>
              {((isMobile && !selectedOption?.label) || !isMobile) && (
                <IconButton
                  sx={{ color: "#fff", fontSize: "1.4rem" }}
                  title="Configure Settings"
                  onClick={handleMenuClick}
                >
                  <TuneRounded />
                </IconButton>
              )}
              <Menu
                anchorEl={anchorEl}
                open={open}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiMenu-paper": {
                    backgroundColor: "#000000ff",
                    fontSize: "14px",
                  },
                }}
              >
                {optionsMap.map((option, index) => (
                  <MenuItem
                    key={index}
                    disabled={option.disabled}
                    onClick={() => {
                      handleMenuClose();
                      handleChatOptionChange(option.value);
                    }}
                    sx={{
                      paddingRight: 7,
                      paddingLeft: 2,
                      color: option.disabled ? "#444" : "#747474",
                      fontWeight: "500",
                      "&:hover": { color: option.disabled ? "#444" : "#fff" },
                    }}
                  >
                    <Box sx={{ marginRight: 2, fontSize: "18px" }}>
                      {option.icon}
                    </Box>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {isSupported && (
              <IconButton
                title={input ? "Send" : "Use voice input"}
                disabled={loadingMesages || !currentConversationId}
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
                {input && !isRecording ? (
                  <SendRounded
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
      </Box>
      <SigninRequiredDialog
        openSigninDialog={openSigninDialog}
        setOpenSigninDialog={setOpenSigninDialog}
        feature={feature ? feature : "upload files"}
      />
      <NewChatPrompt
        showNewConversationDialog={showNewConversationDialog}
        setShowNewConversationDialog={setShowNewConversationDialog}
        setChatOption={updateChatOption}
        chatOptionChangeConfirm={chatOptionChangeConfirm}
      />
    </Grid2>
  );
};

export default InputSection;
