import express from "express";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Set up Nodemailer transporter with corrected environment variable
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS, // Fixed typo from process.eventNames.EMAIL_ADDRESS
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create Express app
const app = express();

app.use(cors());
app.use(express.json());

// Define POST route for subscription
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: "Missing email" }); // Fixed typo "Misssing" to "Missing"
  }

  try {
    // Insert email into Supabase "subscribers" table

    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      throw error;
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS, // Fixed typo from process.env.EAIL_ADDRESS
      to: email,
      subject: "Thanks for Subscribing!",
      html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to AskCho.ai</title>
        </head>
        <body>
            <h1>Welcome to the inner circle!</h1>
            <p>We're thrilled to have you join the AskCho.ai waitlist. You're now one step closer to experiencing groundbreaking AI that's set to redefine how you interact with technology. You're not just signing up for a product; you're becoming part of a journey. By joining us, you'll also contribute to cutting-edge research and learning, helping shape the future of AI that will resonate across the world.</p>
            <p>The countdown has begun! Stay tuned for updates, sneak peeks, and exclusive content as we get closer to launch.</p>
            <p>In the meantime, spread the word! Share your excitement with friends and colleagues and let them know they don't want to miss out on this. They can join the waitlist <a href="https://askcho.ai/waitlist">here</a>.</p>
            <p>The future of intelligent conversation awaits!</p>
            <p>We're excited to have you on board.</p>
            <p>The AskCho Team</p>
        </body>
        </html>
      `,
    });

    // Return success response
    return res.status(200).json({ message: "Subscribed successfully" }); // Fixed typo "messgae" to "message"
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
