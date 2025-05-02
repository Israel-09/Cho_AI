import {
  Grid2,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { AttachFile } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

const InputSection = ({ value, onChange, onEnter }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (isLargeScreen && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline in TextField
      onEnter(value); // Trigger submission
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
        {" "}
        {/* Changed size to 12 to take full width */}
        <TextField
          multiline
          placeholder="AskCho anything"
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
          }}
          InputProps={{
            endAdornment: (
              <>
                <IconButton
                  onClick={() => onEnter(value)}
                  disabled={!value?.trim() || !value}
                  sx={{ fontSize: "1.6rem" }}
                >
                  <SendIcon />
                </IconButton>
                {/* <IconButton sx={{ fontSize: "1.6rem" }}>
                  <AttachFile />
                </IconButton> */}
              </>
            ),
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default InputSection;
