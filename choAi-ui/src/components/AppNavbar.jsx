import {
  Box,
  ClickAwayListener,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircleOutlined as AccountIcon,
  MenuRounded as MenuIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import CookiePolicyDialog from "./CookiePolicyDialog";
import PrivacyPolicyDialog from "./PrivacyPolicyDialog";
import {
  deleteUserAccount,
  deleteAllConversations,
} from "../utils/manageUserAccount";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import useChatStore from "../hooks/chatState";

const NoHistory = () => {
  return (
    <Typography sx={{ fontSize: 12, color: "#b0b0b0" }}>
      No history yet.
    </Typography>
  );
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const AppNavbar = ({}) => {
  const navOpen = useChatStore((state) => state.navOpen);
  const setNavOpen = useChatStore((state) => state.setNavOpen);
  const toggleNav = useChatStore((state) => state.toggleNav);
  const conversationsLoading = useChatStore(
    (state) => state.conversationsLoading
  );
  const conversations = useChatStore((state) => state.conversations);
  const conversationId = useChatStore((state) => state.currentConversationId);

  const handleDrawerToggle = () => {
    toggleNav();
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const maxWidth = 320;
  const minWidth = 60;
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDeleteAccount = async () => {
    if (isProcessing) return;
    if (confirmEmail !== auth.currentUser?.email) {
      setSnackbarError("Email does not match your account");
      return;
    }

    setIsProcessing(true);
    try {
      await deleteUserAccount();
      await signOut(auth);
      setSnackbarError(null);
      handleCloseDialog();
      navigate("/chat");
    } catch (error) {
      setSnackbarError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConversations = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await deleteAllConversations();
      setSnackbarError(null);
      navigate("/chat");
    } catch (error) {
      setSnackbarError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setConfirmEmail("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConfirmEmail("");
  };

  const handleCookiesDialog = () => {
    setCookiesOpen(!cookiesOpen);
  };

  const handlePrivacyDialog = () => {
    setPrivacyOpen(!privacyOpen);
  };

  return (
    <>
      {((isMobile && navOpen) || !isMobile) && (
        <ClickAwayListener onClickAway={() => isMobile && setNavOpen(false)}>
          <Stack
            direction="column"
            gap={1}
            sx={{
              position: isMobile && navOpen ? "absolute" : "block",
              inset: "0 auto 0 0",
              height: "100vh",
              width: navOpen ? maxWidth : "fit-content",
              animation: "fadeIn 1s",
              transition: "width 3s ease-in-out ",
              paddingX: 2,
              zIndex: 2000,
              overflowX: "hidden",
              paddingTop: isMobile ? "15px" : "15px",
              paddingBottom: "20px",
              backgroundColor: "#1a1a1a",
              flexDirection: "column",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Stack
              sx={{
                overflow: "hidden",
                height: isMobile ? "300px" : "60vh",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={handleDrawerToggle}>
                  <MenuIcon
                    sx={{ color: "#fff", fontSize: isMobile ? "26px" : "28px" }}
                  />
                </IconButton>
              </Box>
              {navOpen && (
                <Box sx={{ padding: "10px 10px 0 10px" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: 1,
                      fontWeight: "400",
                      fontSize: "0.8rem",
                    }}
                  >
                    History
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: "12px",
                  width: "100%",
                  height: "80%",
                  display: navOpen ? "block" : "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  overflowY: "hidden",
                  paddingBottom: isMobile ? "20px" : "40px",
                  paddingLeft: "5px",
                  paddingTop: "5px",

                  maskImage:
                    "linear-gradient(to bottom, black 80%, transparent 100%)",
                  "&::-webkit-scrollbar": {
                    width: "5px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "5px",
                    width: "2px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                  "&:hover": {
                    overflowY: "auto",
                  },
                }}
              >
                {conversationsLoading && (
                  <>
                    <Box
                      sx={{
                        textAlign: "center",
                        marginTop: 5,
                        width: "100%",
                        height: "150%",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </>
                )}

                {conversations.length === 0 ? (
                  <Box sx={{ padding: "0 10px 0 10px" }}>
                    <Typography sx={{ fontSize: 12, color: "#b0b0b0" }}>
                      No history yet.
                    </Typography>
                  </Box>
                ) : (
                  conversations.map((item, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      className={
                        navOpen ? "nav-item" : "nav-item nav-item-closed"
                      }
                      color="#ddd"
                      title={item.title}
                      onClick={() =>
                        navigate(`/chat/${item.id}`, { replace: false })
                      }
                      sx={{
                        cursor: "pointer",
                        padding: "10px 10px",
                        fontSize: "13px",
                        color: "#efefef",
                        marginBottom: "5px",
                        backgroundColor:
                          conversationId === item.id
                            ? "#333333aa"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(68, 68, 68, 0.5)",
                          color: "#efefef",
                        },
                        borderRadius: "25px 0 0 25px",
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title}
                      </span>
                    </Stack>
                  ))
                )}
              </Box>
            </Stack>

            {/* This is the new section for the  navigation items*/}
            <Stack
              sx={{
                width: navOpen ? maxWidth - 10 : minWidth - 5,
                overflowY: "hidden",
                fontSize: "14px",
                bottom: 0,
                left: 0,
                height: isMobile ? "fit-content" : "auto",
                paddingY: 2,
                marginTop: 2,
                "&:hover": {
                  overflowY: "auto",
                },
                "&::-webkit-scrollbar": {
                  width: "5px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "5px",
                  width: "2px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              <Stack sx={{ flexGrow: 1, marginBottom: 2 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
                  onClick={() => handlePrivacyDialog()}
                  sx={{ cursor: "pointer", paddingY: 1 }}
                >
                  <i class="bx bx-lock"></i>
                  <span>Privacy policy</span>
                  <PrivacyPolicyDialog
                    privacyOpen={privacyOpen}
                    handlePrivacyDialog={handlePrivacyDialog}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
                  sx={{ cursor: "pointer", paddingY: 1 }}
                  onClick={() => handleCookiesDialog()}
                >
                  <i class="bx bxs-cookie"></i>
                  <span>Cookies Policy</span>
                  <CookiePolicyDialog
                    cookiesOpen={cookiesOpen}
                    handleCookiesClose={handleCookiesDialog}
                    setCookiesOpen={setCookiesOpen}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
                  sx={{ cursor: "pointer", paddingY: 1 }}
                  onClick={() => navigate("/contact-us")}
                >
                  <i class="bx bx-comment-dots"></i>
                  <span>Contact us / Feedback</span>
                </Stack>
              </Stack>
              <Snackbar
                open={!!snackbarError}
                autoHideDuration={6000}
                onClose={() => setSnackbarError(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert severity="error">{snackbarError}</Alert>
              </Snackbar>

              <Stack
                sx={{ paddingLeft: "7px", display: navOpen ? "block" : "None" }}
                className="sub-nav"
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: theme.palette.error.main, cursor: "pointer" }}
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                  onClick={handleDeleteConversations}
                  disabled={isProcessing}
                >
                  <i class="bx bx-x" style={{ fontSize: "24px" }}></i>
                  <span>Delete all chats</span>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: theme.palette.error.main, cursor: "pointer" }}
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                  onClick={handleOpenDialog}
                  disabled={isProcessing}
                >
                  <i class="bx bx-user-circle"></i>
                  <span>Delete acount</span>
                </Stack>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle textAlign={"center"}>
                    Confirm Account Deletion
                  </DialogTitle>
                  <DialogContent>
                    <Typography
                      variant="body1"
                      gutterBottom
                      textAlign={"center"}
                      color="error"
                    >
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      textAlign={"center"}
                    >
                      Please type your email to confirm:
                    </Typography>
                  </DialogContent>
                  <DialogContent>
                    <TextField
                      label="Type your email to confirm"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      fullWidth
                      margin="normal"
                      disabled={isProcessing}
                      helperText={
                        confirmEmail && confirmEmail !== auth.currentUser?.email
                          ? "Email does not match your account"
                          : ""
                      }
                      error={
                        confirmEmail && confirmEmail !== auth.currentUser?.email
                      }
                      autoFocus
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDialog}
                      variant="contained"
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      color="error"
                      disabled={isProcessing || !confirmEmail}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Stack>
            </Stack>
          </Stack>
        </ClickAwayListener>
      )}{" "}
    </>
  );
};

export default AppNavbar;
