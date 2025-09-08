const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send contact form email
exports.sendContactEmail = functions.https.onCall(async (data, context) => {
  const { name, email, subject, message } = data.data;

  if (!name || !email || !subject || !message) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields"
    );
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: "hello@askcho.ai", 
    replyTo: email,
    subject: `Contact Us: ${subject}`,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent from ${email}`);
    return { success: true };
  } catch (error) {
    console.error("sendContactEmail: Error:", error);
    throw new functions.https.HttpsError(
      "internal",
      `Failed to send email: ${error.message}`
    );
  }
});
