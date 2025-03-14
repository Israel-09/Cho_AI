import React, { useState } from "react";
import logo from "@/assets/logo.png";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

const expectations = [
  "SMART AI CHAT - Get instant, insightful responses.",
  "World first AI-POWERED plagiarism checker.",
  "Personalized Experience - Cho adapts to your needs",
];

const CheckIcon = () => {
  return (
    <svg
      width=""
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8075 3.3975L19.5575 1.18875C19.2763 0.908515 18.8955 0.75116 18.4986 0.75116C18.1016 0.75116 17.7208 0.908515 17.4397 1.18875L8.74997 9.77156L5.31028 6.43406C5.02854 6.15474 4.64761 5.9984 4.25088 5.99928C3.85414 6.00016 3.47391 6.15818 3.19341 6.43875L0.943407 8.68875C0.662601 8.96999 0.504883 9.35117 0.504883 9.74859C0.504883 10.146 0.662601 10.5272 0.943407 10.8084L7.65778 17.5584C7.79707 17.6978 7.96245 17.8083 8.14446 17.8837C8.32647 17.9591 8.52155 17.9979 8.71856 17.9979C8.91558 17.9979 9.11066 17.9591 9.29267 17.8837C9.47468 17.8083 9.64005 17.6978 9.77934 17.5584L21.8122 5.52281C21.9517 5.38314 22.0624 5.21729 22.1377 5.03476C22.213 4.85224 22.2516 4.65664 22.2512 4.45918C22.2507 4.26172 22.2113 4.06629 22.1352 3.8841C22.059 3.70191 21.9477 3.53655 21.8075 3.3975ZM8.71434 16.5L1.99997 9.75L4.24997 7.5C4.2527 7.50226 4.25521 7.50477 4.25747 7.5075L8.22778 11.3597C8.36794 11.4968 8.55623 11.5736 8.75231 11.5736C8.9484 11.5736 9.13669 11.4968 9.27684 11.3597L18.5056 2.25L20.75 4.4625L8.71434 16.5Z"
        fill="white"
      />
    </svg>
  );
};

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({
    message: "",
    severity: "",
  });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setFeedback({ message: "", severity: "" });
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !email ||
      !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      setFeedback({
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setFeedback({
          message: "Thank you for subscribing!",
          severity: "success",
        });
        setEmail("");
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setFeedback({
            message: "This email is already subscribed.",
            severity: "error",
          });
        } else {
          throw new Error(errorData.error || "Failed to subscribe");
        }
      }
    } catch (err) {
      setFeedback({
        message: "There was an error subscribing. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "80vh",
        marginTop: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box component="img" src={logo} width={150} marginBottom={3} />
      <Typography sx={{ fontWeight: "600", marginY: 1 }}>
        Your own AI buddy is COMING...
      </Typography>
      <Typography sx={{ textAlign: "center" }}>
        Join the waitlist to be among the first to experience AI-powered
        conversations like never before!
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        {feedback.message && (
          <Alert
            severity={feedback.severity}
            variant="outlined"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
            {feedback.message}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Enter your email"
          name="email"
          autoComplete="email"
          margin="normal"
          sx={{ marginY: 4 }}
          value={email}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading ? true : false}
          sx={{ textTransform: "none" }}
        >
          {loading ? "Subscribing..." : "Join the waitlist"}
        </Button>
      </Box>
      <Typography
        component="body2"
        variant="body2"
        fontSize="0.7rem"
        marginY={1}
      >
        We respect your privacy. No spam, just updates
      </Typography>
      <List>
        <ListSubheader>What to expect from ASKCHO</ListSubheader>
        {expectations.map((item) => {
          return (
            <ListItem dense>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText>{item}</ListItemText>
            </ListItem>
          );
        })}
      </List>
      <Box
        sx={{
          width: "80%",
          display: "flex",
          justifyContent: "Space-between",
          marginTop: 5,
        }}
      >
        <Typography fontSize="0.9rem">
          <Link>Privacy policy</Link>
        </Typography>
        <Typography fontSize="0.9rem">
          <Link>Terms and conditions</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default WaitlistPage;
