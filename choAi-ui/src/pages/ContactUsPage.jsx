import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
  Container,
} from "@mui/material";
import logo from "@/assets/logo.png";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await sendContactEmail(formData);
      setSnackbar({
        open: true,
        message: "Message sent successfully!",
        severity: "success",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to send request: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box component={"img"} src={logo} height={"90px"} width={"140px"} />
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "500", fontSize: "1.5rem" }}
      >
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          disabled={isSubmitting}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          disabled={isSubmitting}
        />
        <TextField
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          disabled={isSubmitting}
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          margin="normal"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            isSubmitting ||
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
          }
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactUsPage;
