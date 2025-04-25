import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircleOutlined as AccountIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useAuth } from "../hooks/useAuth";

const NoHistory = () => {
  return (
    <Typography sx={{ fontSize: 12, color: "#b0b0b0" }}>
      No history yet.
    </Typography>
  );
};

const deleteNavigation = [
  { name: "Delete all chats", icon: <AccountIcon />, path: "/delete" },
  { name: "Delete account", icon: <AccountIcon />, path: "/delete-account" },
];

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const AppNavbar = () => {
  const [open, setOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [history, setHistory] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const maxWidth = 320;
  const minWidth = 60;
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleClickOpen = () => {
    setLogoutConfirm(true);
  };

  const handleClose = () => {
    setLogoutConfirm(false);
  };

  return (
    <ClickAwayListener onClickAway={() => isMobile && setOpen(false)}>
      <Box
        sx={{
          marginRight: 1,
          position: isMobile && open ? "absolute" : "block",
          inset: "0 auto 0 0",
          height: "100vh",
          width: open ? maxWidth : minWidth,
          backgroundColor: "rgba(58, 58, 58, 1)",
          animation: "fadeIn 0.3s",
          transition: "width 0.2s ease-in-out",
          paddingX: 1,
          zIndex: 1,
        }}
        onClickAway={() => setOpen(false)}
      >
        <Stack paddingTop={2} sx={{ width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <IconButton
              sx={{ float: open && "right" }}
              onClick={handleDrawerToggle}
            >
              <i class="bx bx-menu-alt-left" style={{ fontSize: "24px" }}></i>
            </IconButton>
          </Box>

          <Box
            sx={{
              display: open ? "block" : "none",
              paddingLeft: 2,
              maxHeight: isMobile ? "120px" : "300px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "90%",
              overflowY: "hidden",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "5px",
                height: "40px",
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

            {isEmpty(history) ? (
              <NoHistory />
            ) : (
              <>
                <Typography variant="body2" sx={{ marginY: "2px" }}>
                  Today
                </Typography>
                {history.today.length === 0 ? (
                  <NoHistory />
                ) : (
                  <Box
                    sx={{
                      paddingLeft: 1,
                    }}
                  >
                    {history.today.map((item, index) => (
                      <Typography
                        variant="body2"
                        key={index}
                        sx={{ fontSize: "14px", color: "#b0b0b0" }}
                      >
                        {item.title}
                      </Typography>
                    ))}
                  </Box>
                )}

                <Typography variant="body2" sx={{ marginTop: "10px" }}>
                  Last 30 days
                </Typography>
                <Box
                  sx={{
                    paddingLeft: 1,
                  }}
                >
                  {isEmpty(history.last30days) ? (
                    <NoHistory />
                  ) : (
                    <>
                      {history.last30days.map((item, index) => (
                        <Typography
                          variant="body2"
                          key={index}
                          sx={{ fontSize: "16px", color: "#b0b0b0" }}
                        >
                          {item.title}
                        </Typography>
                      ))}
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>

          {/* This is the new section for the  navigation items*/}
          <Box
            sx={{
              position: "absolute",
              height: "330px",
              width: open ? maxWidth - 10 : minWidth - 5,
              display: "flex",
              left: 2,
              flexDirection: "column",
              marginTop: open ? 0 : "170px",
              bottom: 5,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
              }}
            >
              <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                >
                  <i class="bx bxs-binoculars"></i>
                  <span>Explore</span>
                </Stack>
              </a>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bx-user-circle"></i>
                <span>Account</span>
              </Stack>

              <Stack
                sx={{
                  paddingLeft: "7px",
                  marginBottom: "20px",
                  display: open ? "block" : "None",
                }}
              >
                <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    className={open ? "nav-item" : "nav-item nav-item-closed"}
                  >
                    <i class="bx bx-file"></i>
                    <span>Terms of use</span>
                  </Stack>
                </a>
                <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    className={open ? "nav-item" : "nav-item nav-item-closed"}
                  >
                    <i class="bx bx-smile"></i>
                    <span>Privacy policy</span>
                  </Stack>
                </a>
                <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    className={open ? "nav-item" : "nav-item nav-item-closed"}
                  >
                    <i class="bx bxs-hand"></i>
                    <span>give us feedback</span>
                  </Stack>
                </a>
              </Stack>
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                height: "150px",
                width: "100%",
              }}
            >
              <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                >
                  <i class="bx bx-comment-dots"></i>
                  <span>Contact us</span>
                </Stack>
              </a>

              <div>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                  onClick={handleClickOpen}
                  sx={{ cursor: "pointer" }}
                >
                  <i class="bx bx-exit"></i>
                  <span>Log out</span>
                </Stack>
                <Dialog
                  open={logoutConfirm}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Confirm Sign Out"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to sign out?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={logout} autoFocus color="error">
                      Sign Out
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              <Stack
                sx={{ paddingLeft: "7px", display: open ? "block" : "None" }}
                className="sub-nav"
              >
                <a
                  href="#"
                  style={{ textDecoration: "none", color: theme.palette.error }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ color: "#f00" }}
                    className={open ? "nav-item" : "nav-item nav-item-closed"}
                  >
                    <i class="bx bx-x" style={{ fontSize: "24px" }}></i>
                    <span>Delete all chats</span>
                  </Stack>
                </a>
                <a href="#" style={{ textDecoration: "none", color: "0101ff" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ color: "#f00" }}
                    className={open ? "nav-item" : "nav-item nav-item-closed"}
                  >
                    <i class="bx bx-user-circle"></i>
                    <span>Delete account</span>
                  </Stack>
                </a>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </ClickAwayListener>
  );
};

export default AppNavbar;
