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

const PrivacyPolicyDialog = ({ privacyOpen, handlePrivacyDialog }) => {
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
      open={privacyOpen}
      onClose={handlePrivacyDialog}
      maxWidth={isMobile ? "xs" : "md"}
      fullWidth
      aria-labelledby="privacy-policy-dialog-title"
      sx={{
        "& .MuiDialog-paper": { m: isMobile ? 1 : 2 },
      }}
    >
      <DialogTitle
        id="privacy-policy-dialog-title"
        sx={{ fontWeight: "bold", fontSize: isMobile ? "1.25rem" : "1.5rem" }}
      >
        Privacy Policy
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
            p: isMobile ? 2 : 4,
            borderRadius: 2,
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
              AskCho values your privacy and is committed to protecting your
              personal data. This Privacy Policy explains how we collect, use,
              store, and protect your personal data when you interact with our
              AI Chat Box ("Chat Box") in compliance with the General Data
              Protection Regulation (EU) 2016/679 ("GDPR"). By using the Chat
              Box, you acknowledge that you have read and understood this
              policy.
            </Typography>
          </Box>

          {/* Section 2: Data Controller */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              2. Data Controller
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              AskCho Technology Limited is the data controller responsible for
              processing your personal data. If you have any questions, you can
              contact us at:{" "}
              <a
                href="mailto:dpo@askcho.ai"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                dpo@askcho.ai
              </a>
            </Typography>
          </Box>

          {/* Section 3: What Personal Data We Collect */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              3. What Personal Data We Collect
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              We may collect and process the following categories of personal
              data:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>
                  <strong>Information You Provide:</strong> Name, email address,
                  contact details, and any other details you voluntarily share.
                </li>
                <li>
                  <strong>Chat Interactions:</strong> Messages exchanged via the
                  Chat Box.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information, and session details.
                </li>
              </ul>
              We do not process special category data (e.g., health, biometric,
              or political opinions) unless explicitly required and legally
              justified.
            </Typography>
          </Box>

          {/* Section 4: Purpose and Legal Basis for Processing */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              4. Purpose and Legal Basis for Processing
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              We process your personal data for the following purposes under the
              corresponding legal bases:
              {/* Note: Placeholder as original content was incomplete */}
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>
                  To provide and improve Chat Box functionality (Legitimate
                  Interest).
                </li>
                <li>
                  To respond to your inquiries and provide support (Contractual
                  Necessity).
                </li>
                <li>To comply with legal obligations (Legal Obligation).</li>
              </ul>
              If we process your data based on consent, you have the right to
              withdraw it at any time.
            </Typography>
          </Box>

          {/* Section 5: Data Retention */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              5. Data Retention
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              We retain your personal data only for as long as necessary to
              fulfill the purposes outlined in this policy or as required by
              law. Retention periods are determined by:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>Legal and regulatory obligations.</li>
                <li>The need to resolve disputes.</li>
                <li>System performance and security requirements.</li>
              </ul>
              Once the retention period expires, we securely delete or anonymize
              your data.
            </Typography>
          </Box>

          {/* Section 6: Data Sharing and Transfers */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              6. Data Sharing and Transfers
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              We do not sell or rent your personal data. We may share your data
              with:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>
                  <strong>Service Providers:</strong> Third-party vendors
                  assisting in system operations (under strict confidentiality
                  agreements).
                </li>
                <li>
                  <strong>Regulatory Authorities:</strong> When required by law
                  or legal proceedings.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of mergers,
                  acquisitions, or restructuring, your data may be transferred
                  to the new entity.
                </li>
              </ul>
              If your data is transferred outside the European Economic Area
              (EEA), we ensure adequate protection through:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>The European Commission’s adequacy decisions.</li>
                <li>Standard Contractual Clauses (SCCs).</li>
                <li>Other legally approved mechanisms.</li>
              </ul>
            </Typography>
          </Box>

          {/* Section 7: Your GDPR/NDPA Rights */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              7. Your GDPR/NDPA Rights
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              Under the GDPR, you have the following rights:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>
                  <strong>Right to Access:</strong> Request a copy of your
                  personal data.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Correct inaccurate or
                  incomplete data.
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your
                  data under certain conditions.
                </li>
                <li>
                  <strong>Right to Restriction:</strong> Limit processing of
                  your data in specific cases.
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Receive your data
                  in a structured format or transfer it to another provider.
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to processing based
                  on legitimate interests.
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw
                  previously given consent.
                </li>
                <li>
                  <strong>Right to Lodge a Complaint:</strong> If we deprive you
                  of the rights listed above, you can lodge a complaint with the
                  Data Protection Supervisory Authority of your country. We
                  advise reaching out to us first at{" "}
                  <a
                    href="mailto:hello@askcho.ai"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    hello@askcho.ai
                  </a>
                  .
                </li>
              </ul>
            </Typography>
          </Box>

          {/* Section 8: Security Measures */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              8. Security Measures
            </Typography>
            <Typography {...typographyStyles.body1} component="div">
              We implement technical and organizational measures to protect your
              data against unauthorized access, loss, or misuse. These include:
              <ul style={{ paddingLeft: isMobile ? "16px" : "24px" }}>
                <li>Encryption and access controls.</li>
                <li>Regular security audits and risk assessments.</li>
                <li>Secure data storage and transmission practices.</li>
              </ul>
              However, no system is entirely secure, and we encourage you to
              avoid sharing sensitive personal data via the Chat Box.
            </Typography>
          </Box>

          {/* Section 9: Automated Decision-Making and Profiling */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              9. Automated Decision-Making and Profiling
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              The Chat Box may use AI to provide automated responses, but it
              does not make decisions that produce legal effects or
              significantly affect you without human oversight.
            </Typography>
          </Box>

          {/* Section 10: Third-Party Links and Services */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              10. Third-Party Links and Services
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              The Chat Box may contain links to external websites. We are not
              responsible for their privacy practices and encourage you to
              review their policies separately.
            </Typography>
          </Box>

          {/* Section 11: Updates to This Privacy Policy */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              11. Updates to This Privacy Policy
            </Typography>
            <Typography {...typographyStyles.body1} paragraph>
              We may update this Privacy Policy from time to time to reflect
              changes in legal requirements or our practices. Any updates will
              be posted on our website with the revised "Effective Date."
            </Typography>
          </Box>

          {/* Section 12: Contact Information */}
          <Box mb={isMobile ? 3 : 4}>
            <Typography {...typographyStyles.h6} component="h2" gutterBottom>
              12. Contact Information
            </Typography>
            <Typography {...typographyStyles.body1}>
              If you have questions or concerns about this Privacy Policy or
              your data rights, contact us at:{" "}
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
          onClick={handlePrivacyDialog}
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

export default PrivacyPolicyDialog;
