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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../assets/logo.png"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { AddComment, AddCommentRounded } from "@mui/icons-material";

const AppHeader = ({ handleDrawerToggle }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();

  const navigate = useNavigate();

  const getUserInitials = () => {
    const names = user?.displayName.split(" ");

    if (names.length > 1) {
      return (
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
      );
    } else if (names.length === 1) {
      return user.displayName.charAt(0).toUpperCase();
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
      {isMobile && (
        <Grid2>
          <IconButton onClick={handleDrawerToggle} sx={{ padding: 0 }}>
            <i class="bx bx-menu-alt-left" style={{ fontSize: "32px" }}></i>
          </IconButton>
        </Grid2>
      )}
      <Grid2 sx={{ cursor: "pointer" }} onClick={() => navigate("/chat")}>
        <Box
          component="img"
          src={logo}
          sx={{
            height: isMobile ? "50px" : " 70px",
            width: "auto",
          }}
        />
      </Grid2>
      {user ? (
        <Grid2 container sx={{ gap: 3, alignItems: "flex-start" }}>
          <IconButton sx={{ padding: 0 }} onClick={() => navigate("/chat")}>
            <AddComment sx={{ fontSize: isMobile ? "26px" : "36px" }} />
          </IconButton>
          <Avatar
            sx={{
              height: isMobile ? "26px" : "32px",
              width: isMobile ? "26px" : "32px",
              cursor: "pointer",
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
                class="bx bx-exit"
                style={{ fontSize: "20px", paddingRight: "10px" }}
              />{" "}
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
