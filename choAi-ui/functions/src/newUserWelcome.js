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
  service: "gmail", // Use your email service (e.g., Gmail, SendGrid)
  auth: {
    user: user, // e.g., "your-email@gmail.com"
    pass: password, // App-specific password or API key
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
      <h1>Hi, ${user.displayName || "User"}!</h1>
      <p>Welcome to AskCho! 🎉 We're excited to have your on board.</p>
      <p>As your AI buddy, AskCho is here to assist and support you.</p>
      <p>As your AI buddy, AskCho is here to assist and support you.</p>
        <h5>Let's Get Started</h5>
       <p> Whether you're a student, creative, professional, entrepreneur, developer, or just seeking knowledge, AskCho's here to help. Start a chat with your AI buddy now and discover how we can support you! 💬</p>
 Stay Connected
- Follow AskCho: https://www.instagram.com/askcho.ai?igsh=d3h2aGhoNDBvZnd0&utm_source=qr
- Need support? [support email]
Looking forward to chatting with you! 🚀
Best,
The AskCho Team

     
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
