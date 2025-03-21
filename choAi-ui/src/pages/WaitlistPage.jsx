import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import wailistBackground from "@/assets/waitlist-background.png";

const WaitlistPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [lightShade, setLightShade] = useState(false);
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
    setFeedback({ message: "", severity: "" });
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
      const controller = new AbortController();
      const timeout = 38000;

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      const response = await fetch(
        `${import.meta.env.VITE_ASKCHO_API_URL}/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          signal: controller.signal,
        }
      );

      if (response.ok) {
        alert("Thank you for subscribing");
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

  useEffect(() => {
    const interval = setInterval(() => {
      setLightShade((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        backgroundImage: `url(${wailistBackground})`,
        backgroundPosition: "50% 20%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h1"
          sx={{
            textAlign: "center",
            fontSize: isMobile ? "2.5rem" : "3.5rem",
            fontWeight: "600",
            color: lightShade ? "white" : "black",
            WebkitTextStroke: !lightShade && "1px white",
          }}
        >
          Coming Soon!
        </Typography>
        <Box
          sx={{
            marginTop: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: lightShade
              ? "rgba(255, 255, 255, 0.18)"
              : "rgba(211, 211, 211, 0.2)",
            padding: isMobile ? "14px 32px" : "32px 32px",
            borderRadius: "48px",
            border: "1px solid rgba(211, 211, 211, 1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            component="h3"
            variant="h1"
            sx={{
              fontSize: isMobile ? "1.8rem" : "3rem",
              fontWeight: "500",
              textAlign: "center",
              marginBottom: "20px",
              lineHeight: "40px",
            }}
          >
            Be among the first to experience groundbreaking AI
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: isMobile ? "0.9rem" : "1.2rem",
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            Join the waitlist. Be the first to know when we launch. Your future
            of AI insights starts here.
          </Typography>
          {feedback.message && (
            <Alert
              severity={feedback.severity}
              variant="outlined"
              sx={{ width: "100%", marginTop: "15px" }}
              onClose={handleClose}
            >
              {feedback.message}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Email Address"
            placeholder="Your Email Address"
            value={email}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    disabled={loading ? true : false}
                    onClick={handleSubmit}
                  >
                    {loading ? "Subscribing..." : "GET NOTIFIED"}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              marginTop: "15px",
              backgroundColor: "black",
              borderRadius: theme.shape.borderRadius,
              boxShadow: !lightShade && "0 4px 8px rgba(61, 61, 61, 1)",
            }}
          />
          <Typography
            variant="h1"
            sx={{ fontSize: "0.8rem", marginTop: "5px" }}
          >
            We respect your privacy. No spam, just updates
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default WaitlistPage;
