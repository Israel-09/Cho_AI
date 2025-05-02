import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
  Button,
  DialogActions,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const CookiePolicyDialog = ({
  cookiesOpen,
  handleCookiesClose,
  setCookiesOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile breakpoint (<600px)

  // Responsive typography styles
  const typographyStyles = {
    h5: {
      variant: isMobile ? "h6" : "h5",
      fontWeight: "bold",
      fontSize: isMobile ? "1.25rem" : "1.75rem",
    },
    h6: {
      variant: isMobile ? "subtitle1" : "h6",
      fontWeight: "medium",
      fontSize: isMobile ? "1rem" : "1.25rem",
    },
    subtitle1: {
      variant: isMobile ? "subtitle2" : "subtitle1",
      fontWeight: "medium",
      fontSize: isMobile ? "0.875rem" : "1rem",
    },
    body1: {
      variant: isMobile ? "body2" : "body1",
      color: "text.primary",
      fontSize: isMobile ? "0.75rem" : "1rem",
    },
    body2: {
      variant: isMobile ? "caption" : "body2",
      color: "text.primary",
      fontSize: isMobile ? "0.75rem" : "0.875rem",
    },
    subtitle2: {
      variant: isMobile ? "caption" : "subtitle2",
      color: "text.secondary",
      fontSize: isMobile ? "0.75rem" : "0.875rem",
    },
  };

  return (
    <Dialog
      open={cookiesOpen}
      onClose={handleCookiesClose}
      maxWidth={isMobile ? "xs" : "md"} // Smaller dialog width on mobile
      fullWidth
      aria-labelledby="cookie-policy-dialog-title"
      sx={{ "& .MuiDialog-paper": { m: isMobile ? 1 : 2 } }} // Reduced margin on mobile
    >
      <DialogTitle
        id="cookie-policy-dialog-title"
        sx={{ fontWeight: "bold", fontSize: isMobile ? "1.25rem" : "1.5rem" }}
      >
        Cookie Policy
      </DialogTitle>
      <DialogContent
        sx={{
          overflowY: "hidden",
          height: isMobile ? "60vh" : "70vh",
          "&:hover": { overflow: "auto" },
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "5px",
            width: "2px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 2 : 4, // Less padding on mobile
            borderRadius: 2,
            overflowY: "hidden",
          }}
        >
          {/* Header Section */}
          <Box mb={isMobile ? 2 : 3}>
            <Typography {...typographyStyles.h5} component="h1">
              AskCho Technology Limited
            </Typography>
            <Typography {...typographyStyles.subtitle2} sx={{ mt: 1 }}>
              Effective Date: 1st May, 2025
            </Typography>
          </Box>

          {/* Section 1: Introduction */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              1. Introduction
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              This Cookie Policy explains how AskCho Technology Limited ("we,"
              "us," or "our") uses cookies and similar tracking technologies
              when you interact with our AI Chat Box ("Chat Box"). By using the
              Chat Box, you agree to the use of cookies as described in this
              policy.
            </Typography>
          </Box>

          {/* Section 2: What Are Cookies? */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              2. What Are Cookies?
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              Cookies are small text files stored on your device (computer,
              smartphone, or tablet) when you visit a website or interact with
              an online service. They help improve functionality, enhance user
              experience, and provide analytical insights.
            </Typography>
          </Box>

          {/* Section 3: Types of Cookies We Use */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              3. Types of Cookies We Use
            </Typography>

            <Box mb={isMobile ? 1 : 2}>
              <Typography {...typographyStyles.subtitle1} gutterBottom>
                3.1 Essential Cookies
              </Typography>
              <Typography {...typographyStyles.body2}>
                These cookies are necessary for the proper functioning of the
                Chat Box. They enable core functionalities such as session
                management and security.
                <br />• Example: Authentication cookies for maintaining user
                sessions.
              </Typography>
            </Box>

            <Box mb={isMobile ? 1 : 2}>
              <Typography {...typographyStyles.subtitle1} gutterBottom>
                3.2 Functional Cookies
              </Typography>
              <Typography {...typographyStyles.body2}>
                These cookies enhance the Chat Box experience by remembering
                user preferences and interactions.
                <br />• Example: Language selection and chat history retention.
              </Typography>
            </Box>

            <Box mb={isMobile ? 1 : 2}>
              <Typography {...typographyStyles.subtitle1} gutterBottom>
                3.3 Analytical and Performance Cookies
              </Typography>
              <Typography {...typographyStyles.body2}>
                These cookies help us understand how users interact with the
                Chat Box, allowing us to improve its functionality.
                <br />• Example: Tracking the number of users and identifying
                common queries.
              </Typography>
            </Box>

            <Box mb={isMobile ? 1 : 2}>
              <Typography {...typographyStyles.subtitle1} gutterBottom>
                3.4 Advertising and Third-Party Cookies (if applicable)
              </Typography>
              <Typography {...typographyStyles.body2}>
                If the Chat Box integrates with third-party services (e.g.,
                analytics tools or advertisements), these cookies may track user
                behavior across different platforms.
                <br />• Example: Google Analytics or similar tracking services.
              </Typography>
            </Box>
          </Box>

          {/* Section 4: How We Use Cookies */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              4. How We Use Cookies
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              We use cookies to:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>Ensure the Chat Box functions properly.</li>
                <li>Improve user experience by remembering preferences.</li>
                <li>Analyze usage patterns for service improvement.</li>
                <li>Enhance security and prevent fraudulent activities.</li>
              </ul>
            </Typography>
          </Box>

          {/* Section 5: Managing Your Cookie Preferences */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              5. Managing Your Cookie Preferences
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              You can manage or disable cookies through your browser settings.
              However, restricting certain cookies may affect the performance of
              the Chat Box.
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>
                  <strong>Browser Settings:</strong> Adjust cookie preferences
                  in your browser (e.g., Chrome, Firefox, Safari).
                </li>
                <li>
                  <strong>Cookie Consent Banner:</strong> If applicable, you can
                  accept or reject non-essential cookies when using the Chat
                  Box.
                </li>
              </ul>
            </Typography>
          </Box>

          {/* Section 6: Third-Party Cookies */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              6. Third-Party Cookies
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              Some cookies may be placed by third-party providers for analytics,
              security, or other functionalities. We encourage users to review
              their respective privacy policies for more details.
            </Typography>
          </Box>

          {/* Section 7: Updates to This Cookie Policy */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              7. Updates to This Cookie Policy
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              We may update this Cookie Policy periodically. Any changes will be
              posted with the updated "Effective Date." Continued use of the
              Chat Box signifies acceptance of the revised policy.
            </Typography>
          </Box>

          {/* Section 8: Contact Us */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              8. Contact Us
            </Typography>
            <Typography {...typographyStyles.body1}>
              For any questions regarding this Cookie Policy, please contact us
              at{" "}
              <a
                href="mailto:dpo@askcho.ai"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                dpo@askcho.ai
              </a>
              .
            </Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 1 : 2 }}>
        <Button
          onClick={() => {
            console.log("button clicked");
            setCookiesOpen(false);
          }}
          variant="contained"
          color="primary"
          sx={{
            minWidth: isMobile ? 80 : 100,
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookiePolicyDialog;
