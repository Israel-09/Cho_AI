import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

const NewChatPrompt = ({
  showNewConversationDialog,
  setShowNewConversationDialog,
  setChatOption,
  chatOptionChangeConfirm,
}) => {
  return (
    <Dialog
      open={showNewConversationDialog}
      onClose={() => {
        setShowNewConversationDialog(false);
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#000000ff",
          color: "white",
        },
      }}
    >
      <DialogTitle>Start a New Conversation?</DialogTitle>
      <DialogContent sx={{ maxWidth: "400px" }}>
        You are about to switch to a different chat mode. This will start a new
        conversation . Do you want to proceed?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setChatOption("");
            setShowNewConversationDialog(false);
          }}
          color="error"
        >
          Cancel
        </Button>
        <Button onClick={chatOptionChangeConfirm} autoFocus>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChatPrompt;
