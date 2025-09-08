import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

const SigninRequiredDialog = ({
  openSigninDialog,
  setOpenSigninDialog,
  feature,
}) => {
  const handleCloseSigninDialog = () => {
    setOpenSigninDialog(false);
  };

  return (
    <Dialog open={openSigninDialog} onClose={handleCloseSigninDialog}>
      <DialogTitle>Sign In Required</DialogTitle>
      <DialogContent>Please sign in to {feature}.</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => navigate("/signin")}>
          Sign In
        </Button>
        <Button onClick={handleCloseSigninDialog} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SigninRequiredDialog;
