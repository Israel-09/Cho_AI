import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Avatar, Box, Button, Grid, Grid2 } from "@mui/material";
import logo from "../assets/logo.png"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { user } = useAuth();

  const navigate = useNavigate();

  const getUserInitials = () => {
    const length = user.displayName.length;
    if (length > 1) {
      console.log(user.displayName);
      const names = user.displayName.split(" ");
      return (
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
      );
    } else if (length === 1) {
      return user.displayName.charAt(0).toUpperCase();
    } else {
      return "U"; // Default to 'U' if no name is available
    }
  };
  return (
    <Grid2
      container
      sx={{
        width: "95%",
        height: "40px",
        marginY: "20px",
        marginLeft: "20px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Grid2>
        <Box
          component="img"
          src={logo}
          sx={{ height: "30px", width: "auto" }}
        />
      </Grid2>
      {user ? (
        <Grid2 sx={{ display: "flex", gap: 2 }}>
          <Avatar>{getUserInitials()}</Avatar>
        </Grid2>
      ) : (
        <Grid2 sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => navigate("/signin")}>
            Sign in
          </Button>
          <Button variant="outlined" onClick={() => navigate("/signup")}>
            Sign up for free
          </Button>
        </Grid2>
      )}
    </Grid2>
  );
};

export default AppHeader;
