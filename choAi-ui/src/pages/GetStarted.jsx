import React, { useState } from "react";
import Username from "../components/Username";
import {
  Alert,
  Box,
  Button,
  Fade,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import PersonaPage from "./PersonaPage";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const [name, setName] = useState("");
  const [page, setPage] = useState(0);
  const [show, setShow] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleNext = () => {
    if (isMobile) {
      navigate("/chat", { state: { name } });
      return;
    }
    setError("");
    if (name.trim() === "") {
      setError("Please enter your name.");
      return;
    }
    setShow(false);
    setTimeout(() => {
      setPage((prev) => (prev == 0 ? 1 : 0));
      setShow(true);
    }, 300);
  };

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Fade in={show} timeout={300}>
        <Box>
          {page === 0 ? (
            <>
              <Username
                handleNext={handleNext}
                name={name}
                handleChange={handleChange}
              />
            </>
          ) : (
            <>
              <PersonaPage name={name} />
            </>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default GetStarted;
