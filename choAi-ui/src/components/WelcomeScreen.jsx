import { Box, Grid2, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import SendIcon from "@mui/icons-material/Send";
import FeatureCard from "./FeatureCard";
import { useAuth } from "../hooks/useAuth";
import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";

const WelcomeScreen = () => {
  const [input, setInput] = useState("");
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    async function fetchGreeting() {
      setLoading(true);
      try {
        const getGreetingFunction = httpsCallable(functions, "getGreeting");
        const clientLocale = navigator.language || navigator.userLanguage;
        const response = await getGreetingFunction({ locale: clientLocale });

        setGreeting(response.data);
      } catch (error) {
        console.error("Error fetching greeting:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGreeting();
  }, []);

  return (
    <Grid2
      container
      sx={{ width: "100%", height: "100%", justifyContent: "center" }}
    >
      <FeatureCard />
      {/* header section */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.5rem",
            textAlign: "center",
            fontWeight: "700",
            margin: 0,
            background:
              "-webkit-linear-gradient(left, rgba(255, 255, 255, 1), rgba(153, 153, 153, 1))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {greeting + " " || ""}
          {user
            ? user.displayName?.split(" ")[0].toUpperCase()
            : greeting && "GUEST"}
        </Typography>
        <Typography
          variant="body2"
          color="rgba(153, 153, 153, 1)"
          sx={{ marginTop: -1, fontSize: "0.9rem", textAlign: "center" }}
        >
          how can I help you?
        </Typography>
      </Box>
      {/*input section */}
      <Grid2
        container
        gap={1}
        marginTop={2}
        sx={{ width: "95%", alignItems: "center", flexWrap: "nowrap" }}
      >
        <Grid2 size={11}>
          <TextField
            placeholder="AskCho anything"
            variant="outlined"
            onChange={handleChange}
            name="input"
            value={input}
            fullWidth
          />
        </Grid2>
        <Grid2>
          <IconButton>
            <SendIcon />
          </IconButton>
        </Grid2>
        <Grid2>
          <IconButton>
            <KeyboardVoiceIcon />
          </IconButton>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default WelcomeScreen;
