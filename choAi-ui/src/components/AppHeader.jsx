import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Grid2,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../assets/logo.png"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { AddComment } from "@mui/icons-material";

const AppHeader = ({ handleDrawerToggle, aiMode, setAiMode }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [openSigninDialog, setOpenSigninDialog] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  // State for AI mode
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getUserInitials = () => {
    const names = user?.displayName?.split(" ") || [];
    if (names.length > 1) {
      return (
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
      );
    } else if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return "U";
    }
  };

  // Handle Avatar click to open menu
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setLogoutConfirm(true);
  };

  const handleDialogClose = () => {
    setLogoutConfirm(false);
  };

  // Handle AI mode change
  const handleAiModeChange = (event) => {
    setAiMode(event.target.value);
  };

  const handleFormControlClick = () => {
    if (!user) {
      setOpenSigninDialog(true);
    }
  };

  const handleCloseSigninDialog = () => {
    setOpenSigninDialog(false);
  };
  return (
    <Grid2
      container
      sx={{
        width: "90%",
        height: "30px",
        marginBottom: "5px",
        marginLeft: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {isMobile && user && (
        <Grid2>
          <IconButton onClick={handleDrawerToggle} sx={{ padding: 0 }}>
            <i className="bx bx-menu-alt-left" style={{ fontSize: "32px" }}></i>
          </IconButton>
        </Grid2>
      )}

      {/* Clickable Logo */}
      <Grid2
        sx={{
          width: "20",
          display: "flex",
          gap: isMobile ? 1 : 2,
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="AskCho Logo"
          sx={{
            height: isMobile ? "50px" : "70px",
            width: "auto",
            cursor: "pointer",
          }}
          onClick={() => navigate("/chat")}
        />
        {/* AI Mode Dropdown */}
        <FormControl
          sx={{ minWidth: 120 }}
          size="small"
          disabled={!user}
          onClick={handleFormControlClick}
        >
          <Select
            value={aiMode}
            onChange={handleAiModeChange}
            displayEmpty
            sx={{
              color: "#fff",
              fontSize: isMobile ? "0.8rem" : "1rem",
              backgroundColor: "#171717",
              borderRadius: "8px",
              "& .MuiSelect-icon": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
            }}
          >
            <MenuItem
              value="chatBuddy"
              sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}
            >
              Chat Buddy
            </MenuItem>
            <MenuItem
              value="proAssistant"
              sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}
            >
              Pro Assistant
            </MenuItem>
          </Select>
        </FormControl>
        <Dialog open={openSigninDialog} onClose={handleCloseSigninDialog}>
          <DialogTitle>Sign In Required</DialogTitle>
          <DialogContent>Please sign in to change the AI mode.</DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
            <Button onClick={handleCloseSigninDialog} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid2>

      {user ? (
        <Grid2 container sx={{ gap: 2, alignItems: "center" }}>
          {/* New Chat Icon */}
          <IconButton sx={{ padding: 0 }} onClick={() => navigate("/chat")}>
            <AddComment
              sx={{ fontSize: isMobile ? "26px" : "32px", color: "#fff" }}
            />
          </IconButton>

          {/* Avatar and Menu */}
          <Avatar
            sx={{
              height: isMobile ? "26px" : "32px",
              width: isMobile ? "26px" : "32px",
              cursor: "pointer",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              ":hover": {
                boxShadow: "0 0 8px rgba(202, 198, 198, 0.3)",
              },
            }}
            onClick={handleAvatarClick}
          >
            {getUserInitials()}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiMenu-paper": {
                marginTop: "5px",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                minWidth: isMobile ? "150px" : "250px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(53, 53, 53, 0.2)",
                border: "0.01rem solid #fff",
              },
              "& .MuiMenuItem-root": {
                fontSize: isMobile ? "0.8rem" : "1rem",
                padding: isMobile ? "5px 10px" : "10px 20px",
              },
            }}
          >
            <MenuItem onClick={handleClickOpen} sx={{ color: "#ef0909" }}>
              <i
                className="bx bx-exit"
                style={{ fontSize: "20px", paddingRight: "10px" }}
              />
              Sign Out
            </MenuItem>
          </Menu>
          <Dialog
            open={logoutConfirm}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ textAlign: "center" }}
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Sign Out"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to sign out?
                <br /> Your conversations will no longer be saved till you sign
                in
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button onClick={logout} autoFocus color="error">
                Sign Out
              </Button>
            </DialogActions>
          </Dialog>
        </Grid2>
      ) : (
        <Grid2 sx={{ display: "flex", gap: 2, height: "100%" }}>
          <IconButton sx={{ padding: 0 }} onClick={() => navigate("/chat")}>
            <AddComment
              sx={{ fontSize: isMobile ? "26px" : "32px", color: "#fff" }}
            />
          </IconButton>
          <Button
            variant="contained"
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate("/signin")}
          >
            Sign in
          </Button>
          {!isMobile && (
            <Button
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              onClick={() => navigate("/signup")}
            >
              Sign up for free
            </Button>
          )}
        </Grid2>
      )}
    </Grid2>
  );
};

export default AppHeader;
