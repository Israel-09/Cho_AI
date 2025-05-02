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
} from "@mui/material";
import {
  AccountCircleOutlined as AccountIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
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

const AppNavbar = ({
  conversations = [],
  conversationId,
  handleDrawerToggle,
  navOpen,
  setNavOpen,
}) => {
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
    <ClickAwayListener onClickAway={() => isMobile && setNavOpen(false)}>
      <Box
        sx={{
          marginRight: 1,
          position: isMobile && navOpen ? "absolute" : "block",
          inset: "0 auto 0 0",
          height: "100vh",
          width: navOpen ? maxWidth : minWidth,
          backgroundColor: "rgb(24, 23, 23)",
          animation: "fadeIn 0.3s",
          transition: "width 0.2s ease-in-out",
          paddingX: 1,
          zIndex: 1,
        }}
        onClickAway={() => setNavOpen(false)}
      >
        <Stack paddingTop={2} sx={{ width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <IconButton
              sx={{ float: navOpen && "right" }}
              onClick={handleDrawerToggle}
            >
              <i class="bx bx-menu-alt-left" style={{ fontSize: "24px" }}></i>
            </IconButton>
          </Box>

          <Box
            sx={{
              paddingRight: 2,
              display: navOpen ? "block" : "none",
              height: isMobile ? "30vh" : "45vh",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: navOpen ? maxWidth - 10 : minWidth - 5,
              overflowY: "hidden",
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
            <Typography
              variant="body1"
              sx={{ marginBottom: 1, fontWeight: "700", fontSize: "0.9rem" }}
            >
              History
            </Typography>

            {isEmpty(conversations) ? (
              <NoHistory />
            ) : (
              conversations.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1}
                  marginBottom={"2px"}
                  alignItems="center"
                  className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
                  color="#ddd"
                  onClick={() => navigate(`/chat/${item.id}`)}
                  sx={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    fontSize: "14px",
                    backgroundColor:
                      conversationId === item.id ? "#444" : "transparent",
                    color: conversationId === item.id ? "white" : "#ddd",
                    "&:hover": {
                      backgroundColor: "#444",
                      borderRadius: "5px",
                    },
                  }}
                >
                  <span>{item.title}</span>
                </Stack>
              ))
            )}
          </Box>

          {/* This is the new section for the  navigation items*/}
          <Box
            sx={{
              height: isMobile ? "35vh" : "40vh",
              width: navOpen ? maxWidth - 10 : minWidth - 5,
              overflowY: "hidden",
              position: "absolute",
              bottom: 0,
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
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
              sx={{
                color: "#fff",
                cursor: "pointer",
              }}

              // onClick={() => navigate("/explore")}
            >
              <i class="bx bxs-binoculars"></i>
              <span>Explore</span>
            </Stack>
            {/* 
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={ navOpen? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bx-user-circle"></i>
                <span>Account</span>
              </Stack> */}

            <Stack
              sx={{
                paddingLeft: "7px",
                marginBottom: "20px",
                display: navOpen ? "block" : "None",
              }}
            >
              {/* <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
                >
                  <i class="bx bx-file"></i>
                  <span>Terms of use</span>
                </Stack>
              </a> */}
              <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
                  onClick={() => handlePrivacyDialog()}
                  sx={{ cursor: "pointer" }}
                >
                  <i class="bx bx-lock"></i>
                  <span>Privacy policy</span>
                  <PrivacyPolicyDialog
                    privacyOpen={privacyOpen}
                    handlePrivacyDialog={handlePrivacyDialog}
                  />
                </Stack>
              </a>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
                sx={{ cursor: "pointer" }}
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
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className={navOpen ? "nav-item" : "nav-item nav-item-closed"}
            >
              <i class="bx bx-comment-dots"></i>
              <span>Contact us / Feedback</span>
            </Stack>

            {/* <div>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                  sx={{ cursor: "pointer" }}
                >
                  <i class="bx bx-exit"></i>
                  <span>Log out</span>
                </Stack>
              </div> */}

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
                sx={{ color: "#f00" }}
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
                sx={{ color: "#f00", cursor: "pointer" }}
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
          </Box>
        </Stack>
      </Box>
    </ClickAwayListener>
  );
};

export default AppNavbar;
