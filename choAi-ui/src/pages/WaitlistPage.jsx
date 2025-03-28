import {
  Alert,
  Box,
  Button,
  Container,
  Grid2,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import wailistBackground from "@/assets/waitlist-background.png";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const features = [
  "Intelligent chats",
  "Tailored responses",
  "Insights you won't find anywhere else",
];
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
            fontSize: isMobile ? "2rem" : "3.5rem",
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
              ? "rgba(255, 255, 255, 0.19)"
              : "rgba(211, 211, 211, 0.2)",
            padding: isMobile ? "14px 24px" : "32px 32px",
            borderRadius: "48px",
            border: "1px solid rgba(211, 211, 211, 1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: isMobile ? "1.3rem" : "3rem",
              fontWeight: "500",
              textAlign: "center",
              marginBottom: "5px",
              lineHeight: isMobile ? "18px" : "40px",
            }}
          >
            <span
              style={{
                fontFamily: "David Libre",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              Be among the first to experience{" "}
            </span>
            <br />
            Groundbreaking&nbsp;AI
          </Typography>
          <Grid2 container sx={{ width: "100%", justifyContent: "center" }}>
            {features.map((feature, index) => (
              <Grid2 key={index} container sx={{ marginBottom: "5px" }}>
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: isMobile ? "16px" : "18px",
                    marginLeft: isMobile ? "7px" : "15px",
                  }}
                />
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    fontSize: isMobile ? "0.6rem" : "0.9rem",
                    marginLeft: isMobile ? "2px" : "5px",
                    fontWeight: 400,
                  }}
                >
                  {feature}
                </Typography>
              </Grid2>
            ))}
          </Grid2>
          <Typography
            variant="body1"
            sx={{
              fontSize: isMobile ? "0.5rem" : "0.9rem",
              fontWeight: "500",
              textAlign: "center",
              marginTop: isMobile ? "4px" : "20px",
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
            size={isMobile ? "small" : "medium"}
            value={email}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    sx={{
                      fontSize: isMobile ? "0.4rem" : "0.9rem",
                    }}
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
              marginTop: "5px",
              backgroundColor: "black",
              borderRadius: theme.shape.borderRadius,
              boxShadow: !lightShade && "0 4px 8px rgba(61, 61, 61, 1)",
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: isMobile ? "0.4rem" : "0.8rem",
              marginTop: isMobile ? "" : "5px",
              fontWeight: 400,
            }}
          >
            We respect your privacy. No spam, just updates
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default WaitlistPage;
