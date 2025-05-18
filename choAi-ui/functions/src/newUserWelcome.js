const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const user = process.env.USER_EMAIL;
const password = process.env.USER_PASS;

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: password,
  },
});

// Send welcome email on user creation
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email; // User's email address
  if (!email) {
    console.error("No email found for user:", user.uid);
    return null;
  }

  const mailOptions = {
    from: `"ASKCHO TEAM" <${user}>`, // Sender address
    to: email,
    subject: "Welcome to ASKCHO! 🤖!",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AskCho</title>
    </head>
    <body>
      <h3>Hi, ${user.displayName || "User"}!</h3>
      <p>Welcome to AskCho! 🎉 We're excited to have you on board.</p>
      <p>As your AI buddy, AskCho is here to assist and support you.</p>
      <p>As your AI buddy, AskCho is here to assist and support you.</p>
      <h5>Let's Get Started</h5>
      <p>Whether you're a student, creative, professional, entrepreneur, developer, or just seeking knowledge, AskCho's here to help. Start a chat with your AI buddy now and discover how we can support you! 💬</p>
      <p><strong>Stay Connected</strong></p>
      <p>
        - Follow AskCho: <a href="https://www.instagram.com/askcho.ai?igsh=d3h2aGhoNDBvZnd0&utm_source=qr">https://www.instagram.com/askcho.ai</a><br>
        - Need support? <a href="mailto:noreply@askcho.com">[support email]</a>
      </p>
      <p>Looking forward to chatting with you! 🚀</p>
      <p>Best,<br>The AskCho Team</p>
    </body>
    </html>
    `,
  };

  try {
    console.log("Sending welcome email to:", email);
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", email);
    return null;
  } catch (error) {
    console.error("Error sending welcome email to", email, ":", error);
    return null;
  }
});
